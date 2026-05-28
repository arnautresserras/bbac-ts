import { useState, useRef, useEffect } from "react";
import { BallIcon } from "./icons/BallIcon";
import { FoulIcon } from "./icons/FoulIcon";
import { HitByPitchIcon } from "./icons/HitByPitchIcon";
import { HomeRunIcon } from "./icons/HomeRunIcon";
import { OutIcon } from "./icons/OutIcon";
import { SingleIcon } from "./icons/SingleIcon";
import { StrikeIcon } from "./icons/StrikeIcon";
import { SwingIcon } from "./icons/SwingIcon";
import { WildPitchIcon } from "./icons/WildPitchIcon";
import { CardName } from "../../types/cardName";
import { CARD_DESCRIPTIONS } from "../../data/cardDescriptions";

const iconMap: Record<CardName, React.FC<{ size?: number; color?: string }>> = {
    "Ball": BallIcon,
    "Strike": StrikeIcon,
    "Swing": SwingIcon,
    "Hit by pitch": HitByPitchIcon,
    "Wild pitch": WildPitchIcon,
    "Home run": HomeRunIcon,
    "Single": SingleIcon,
    "Out": OutIcon,
    "Foul": FoulIcon,
};

const CARD_WIDTH = 78;
const CARD_HEIGHT = 110;
const PIVOT_EXT = 200;
const MAX_HALF_ANGLE = 40;
const MAX_HAND_SIZE = 6;

function computeFanAngles(containerWidth: number, count: number): number[] {
    if (count === 0) return [];
    if (count === 1) return [0];
    const margin = 10;
    const pivotDist = CARD_HEIGHT / 2 + PIVOT_EXT;
    const halfAvail = containerWidth / 2 - CARD_WIDTH / 2 - margin;
    const maxSin = Math.sin(MAX_HALF_ANGLE * Math.PI / 180);
    const ratio = Math.max(0, Math.min(halfAvail / pivotDist, maxSin));
    const fullHalfAngle = Math.asin(ratio) * 180 / Math.PI;
    // Fixed step based on full hand size so the fan compresses toward center as cards are played.
    const step = (2 * fullHalfAngle) / (MAX_HAND_SIZE - 1);
    const halfAngle = step * (count - 1) / 2;
    return Array.from({ length: count }, (_, i) => -halfAngle + step * i);
}

interface HandCard {
    originalIndex: number;
    card: CardName;
}

interface Props {
    hand: (CardName | "")[];
    playCard: (card: CardName, index: number) => void;
}

const DisplayHand = ({ hand, playCard }: Props) => {
    const [orderedCards, setOrderedCards] = useState<HandCard[]>([]);
    const [fanAngles, setFanAngles] = useState<number[]>([]);
    const fanAnglesRef = useRef<number[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const pitchZoneRef = useRef<HTMLDivElement>(null);
    const slotRefs = useRef<(HTMLDivElement | null)[]>([]);

    const [dragDisplayIndex, setDragDisplayIndex] = useState<number | null>(null);
    const [insertionIndex, setInsertionIndex] = useState<number | null>(null);
    const activeIndexRef = useRef<number | null>(null);
    const dragStartPos = useRef({ x: 0, y: 0 });
    const dragLocalDelta = useRef({ x: 0, y: 0 });

    const [tooltipIndex, setTooltipIndex] = useState<number | null>(null);
    const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

    // Sync orderedCards with the hand prop.
    // Preserve reorder if only cards were played (removed); reset on new hand.
    useEffect(() => {
        setOrderedCards(prev => {
            const allMatch = prev.length > 0 && prev.every(c => hand[c.originalIndex] === c.card);
            if (allMatch) {
                return prev.filter(c => hand[c.originalIndex] === c.card);
            }
            return hand
                .map((card, i) => (card !== "" ? { originalIndex: i, card: card as CardName } : null))
                .filter((c): c is HandCard => c !== null);
        });
    }, [hand]);

    useEffect(() => {
        const dismiss = (e: PointerEvent) => {
            if (!(e.target as HTMLElement).closest(".hand-card")) {
                setTooltipIndex(null);
                setTooltipPos(null);
            }
        };
        document.addEventListener("pointerdown", dismiss);
        return () => document.removeEventListener("pointerdown", dismiss);
    }, []);

    // Recompute fan angles when the container resizes or the active card count changes.
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const update = () => {
            const angles = computeFanAngles(el.offsetWidth, orderedCards.length);
            fanAnglesRef.current = angles;
            setFanAngles(angles);
        };
        update();
        const ro = new ResizeObserver(update);
        ro.observe(el);
        return () => ro.disconnect();
    }, [orderedCards.length]);

    const isOverZone = (clientX: number, clientY: number) => {
        if (!pitchZoneRef.current) return false;
        const r = pitchZoneRef.current.getBoundingClientRect();
        return clientX >= r.left && clientX <= r.right && clientY >= r.top && clientY <= r.bottom;
    };

    const getInsertionIndex = (clientX: number): number => {
        let best = 0;
        let bestDist = Infinity;
        slotRefs.current.forEach((el, i) => {
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const dist = Math.abs(clientX - centerX);
            if (dist < bestDist) {
                bestDist = dist;
                best = i;
            }
        });
        return best;
    };

    const screenToLocal = (sdx: number, sdy: number, angleDeg: number) => {
        const rad = angleDeg * Math.PI / 180;
        return {
            x: sdx * Math.cos(rad) + sdy * Math.sin(rad),
            y: -sdx * Math.sin(rad) + sdy * Math.cos(rad),
        };
    };

    const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>, displayIndex: number) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        dragStartPos.current = { x: e.clientX, y: e.clientY };
        dragLocalDelta.current = { x: 0, y: 0 };
        activeIndexRef.current = displayIndex;
        setDragDisplayIndex(displayIndex);
        setInsertionIndex(displayIndex);
        const fanAngle = fanAnglesRef.current[displayIndex] ?? 0;
        e.currentTarget.style.transition = "transform 0.18s ease-out";
        e.currentTarget.style.transform = `rotate(${-fanAngle}deg)`;
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>, displayIndex: number) => {
        if (activeIndexRef.current !== displayIndex) return;
        const sdx = e.clientX - dragStartPos.current.x;
        const sdy = e.clientY - dragStartPos.current.y;
        const fanAngle = fanAnglesRef.current[displayIndex] ?? 0;
        const local = screenToLocal(sdx, sdy, fanAngle);
        dragLocalDelta.current = local;
        e.currentTarget.style.transition = "";
        e.currentTarget.style.transform = `translate(${local.x}px, ${local.y}px) rotate(${sdx * 0.02 - fanAngle}deg)`;

        const overZone = isOverZone(e.clientX, e.clientY);
        pitchZoneRef.current?.classList.toggle("pitch-zone--over", overZone);

        if (!overZone) {
            setInsertionIndex(getInsertionIndex(e.clientX));
        }
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>, displayIndex: number) => {
        if (activeIndexRef.current !== displayIndex) return;
        activeIndexRef.current = null;
        pitchZoneRef.current?.classList.remove("pitch-zone--over");

        const over = isOverZone(e.clientX, e.clientY);
        const elem = e.currentTarget;
        const handCard = orderedCards[displayIndex];

        if (over && handCard) {
            const zoneRect = pitchZoneRef.current!.getBoundingClientRect();
            const elemRect = elem.getBoundingClientRect();
            const sdx = (zoneRect.left + zoneRect.width / 2) - (elemRect.left + elemRect.width / 2);
            const sdy = (zoneRect.top + zoneRect.height / 2) - (elemRect.top + elemRect.height / 2);
            const fanAngle = fanAnglesRef.current[displayIndex] ?? 0;
            const localTarget = screenToLocal(sdx, sdy, fanAngle);
            const totalDx = dragLocalDelta.current.x + localTarget.x;
            const totalDy = dragLocalDelta.current.y + localTarget.y;
            elem.style.transition = "transform 0.15s ease-in";
            elem.style.transform = `translate(${totalDx}px, ${totalDy}px) scale(0.8)`;
            const capturedCard = handCard;
            setTimeout(() => {
                elem.style.transition = "";
                elem.style.transform = "";
                setDragDisplayIndex(null);
                setInsertionIndex(null);
                playCard(capturedCard.card, capturedCard.originalIndex);
            }, 150);
        } else {
            const sdx = e.clientX - dragStartPos.current.x;
            const sdy = e.clientY - dragStartPos.current.y;
            const isTap = Math.sqrt(sdx * sdx + sdy * sdy) < 8;

            if (isTap) {
                const rect = e.currentTarget.getBoundingClientRect();
                const closing = tooltipIndex === displayIndex;
                setTooltipIndex(closing ? null : displayIndex);
                setTooltipPos(closing ? null : { x: rect.left + rect.width / 2, y: rect.top });
                elem.style.transition = "";
                elem.style.transform = "";
                setDragDisplayIndex(null);
                setInsertionIndex(null);
                return;
            }

            const finalInsertionIdx = insertionIndex ?? displayIndex;
            if (finalInsertionIdx !== displayIndex) {
                setOrderedCards(prev => {
                    const copy = [...prev];
                    const [dragged] = copy.splice(displayIndex, 1);
                    copy.splice(finalInsertionIdx, 0, dragged);
                    return copy;
                });
            }
            elem.style.transition = "transform 0.2s ease-out";
            elem.style.transform = "";
            setTimeout(() => {
                elem.style.transition = "";
                setDragDisplayIndex(null);
                setInsertionIndex(null);
            }, 200);
        }
    };

    return (
        <div className="hand">
            <div
                ref={pitchZoneRef}
                className={`pitch-zone ${dragDisplayIndex !== null ? "pitch-zone--visible" : ""}`}
            >
                <span className="pitch-zone__label">⚾ Pitch here</span>
            </div>
            <div className="hand-cards-container" ref={containerRef}>
                {orderedCards.map((handCard, displayIndex) => {
                    const fanAngle = fanAngles[displayIndex] ?? 0;
                    const zIndex = dragDisplayIndex === displayIndex ? 1000 : displayIndex + 1;
                    const isDragging = dragDisplayIndex === displayIndex;
                    const IconComponent = iconMap[handCard.card];
                    return (
                        <div
                            key={handCard.originalIndex}
                            ref={el => { slotRefs.current[displayIndex] = el; }}
                            className={`hand-card-slot${isDragging ? " hand-card-slot--dragging" : ""}`}
                            style={{ "--fan-angle": `${fanAngle}deg`, zIndex } as React.CSSProperties}
                        >
                            <button
                                className={`hand-card${isDragging ? " dragging" : ""}`}
                                onPointerDown={(e) => handlePointerDown(e, displayIndex)}
                                onPointerMove={(e) => handlePointerMove(e, displayIndex)}
                                onPointerUp={(e) => handlePointerUp(e, displayIndex)}
                                style={{ touchAction: "none" }}
                            >
                                {IconComponent && (
                                    <div className="hand-card-icon">
                                        <IconComponent size={30} color="black" />
                                    </div>
                                )}
                                <div className="hand-card-title">{handCard.card}</div>
                            </button>
                        </div>
                    );
                })}
            </div>
            {tooltipIndex !== null && tooltipPos !== null && (() => {
                const hc = orderedCards[tooltipIndex];
                if (!hc) return null;
                const desc = CARD_DESCRIPTIONS[hc.card];
                return (
                    <div
                        className="card-tooltip"
                        style={{ left: tooltipPos.x, top: tooltipPos.y }}
                    >
                        <span className="card-tooltip__name">{hc.card}</span>
                        <span className="card-tooltip__desc">{desc?.short}</span>
                    </div>
                );
            })()}
        </div>
    );
};

export default DisplayHand;
