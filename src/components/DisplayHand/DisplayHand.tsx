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
const PIVOT_EXT = 200; // extra distance below card bottom for transform-origin
const MAX_HALF_ANGLE = 40;
const HAND_SIZE = 6;
const FAN_Z_INDICES = [1, 2, 3, 4, 5, 6];
const DEFAULT_FAN_ANGLES = [-40, -24, -8, 8, 24, 40];

// Compute fan angles so the edge cards' centers fit within the container width.
// Uses the geometry of the pivot-based rotation: card center moves 255*sin(θ) horizontally.
function computeFanAngles(containerWidth: number): number[] {
    const margin = 10;
    const pivotDist = CARD_HEIGHT / 2 + PIVOT_EXT; // 255px from card center to pivot
    const halfAvail = containerWidth / 2 - CARD_WIDTH / 2 - margin;
    const maxSin = Math.sin(MAX_HALF_ANGLE * Math.PI / 180);
    const ratio = Math.max(0, Math.min(halfAvail / pivotDist, maxSin));
    const halfAngle = Math.asin(ratio) * 180 / Math.PI;
    const step = HAND_SIZE > 1 ? (2 * halfAngle) / (HAND_SIZE - 1) : 0;
    return Array.from({ length: HAND_SIZE }, (_, i) => -halfAngle + step * i);
}

interface Props {
    hand: (CardName | "")[];
    playCard: (card: CardName, index: number) => void;
}

const DisplayHand = ({ hand, playCard }: Props) => {
    const [dragCardIndex, setDragCardIndex] = useState<number | null>(null);
    const [fanAngles, setFanAngles] = useState<number[]>(DEFAULT_FAN_ANGLES);
    const fanAnglesRef = useRef<number[]>(DEFAULT_FAN_ANGLES);
    const pitchZoneRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const dragStartPos = useRef({ x: 0, y: 0 });
    const activeIndexRef = useRef<number | null>(null);
    const dragLocalDelta = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const update = () => {
            const angles = computeFanAngles(el.offsetWidth);
            fanAnglesRef.current = angles;
            setFanAngles(angles);
        };
        update();
        const ro = new ResizeObserver(update);
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    const isOverZone = (clientX: number, clientY: number) => {
        if (!pitchZoneRef.current) return false;
        const r = pitchZoneRef.current.getBoundingClientRect();
        return clientX >= r.left && clientX <= r.right && clientY >= r.top && clientY <= r.bottom;
    };

    // Convert a screen-space delta into the slot's rotated local coordinate space
    const screenToLocal = (sdx: number, sdy: number, angleDeg: number) => {
        const rad = angleDeg * Math.PI / 180;
        return {
            x: sdx * Math.cos(rad) + sdy * Math.sin(rad),
            y: -sdx * Math.sin(rad) + sdy * Math.cos(rad),
        };
    };

    const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>, index: number) => {
        if (hand[index] === "") return;
        e.currentTarget.setPointerCapture(e.pointerId);
        dragStartPos.current = { x: e.clientX, y: e.clientY };
        dragLocalDelta.current = { x: 0, y: 0 };
        activeIndexRef.current = index;
        setDragCardIndex(index);
        // Smoothly rotate card upright on pickup
        const fanAngle = fanAnglesRef.current[index];
        e.currentTarget.style.transition = "transform 0.18s ease-out";
        e.currentTarget.style.transform = `rotate(${-fanAngle}deg)`;
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>, index: number) => {
        if (activeIndexRef.current !== index) return;
        const sdx = e.clientX - dragStartPos.current.x;
        const sdy = e.clientY - dragStartPos.current.y;
        const local = screenToLocal(sdx, sdy, fanAnglesRef.current[index]);
        dragLocalDelta.current = local;
        // Counter-rotate the slot's fan angle so the card stays upright while dragging
        const fanAngle = fanAnglesRef.current[index];
        e.currentTarget.style.transition = "";
        e.currentTarget.style.transform = `translate(${local.x}px, ${local.y}px) rotate(${sdx * 0.02 - fanAngle}deg)`;
        pitchZoneRef.current?.classList.toggle("pitch-zone--over", isOverZone(e.clientX, e.clientY));
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>, index: number) => {
        if (activeIndexRef.current !== index) return;
        activeIndexRef.current = null;

        const over = isOverZone(e.clientX, e.clientY);
        pitchZoneRef.current?.classList.remove("pitch-zone--over");

        const card = hand[index];
        const elem = e.currentTarget;

        if (over && card !== "") {
            const zoneRect = pitchZoneRef.current!.getBoundingClientRect();
            const elemRect = elem.getBoundingClientRect();
            // Remaining screen-space delta to reach the pitch zone center
            const sdx = (zoneRect.left + zoneRect.width / 2) - (elemRect.left + elemRect.width / 2);
            const sdy = (zoneRect.top + zoneRect.height / 2) - (elemRect.top + elemRect.height / 2);
            const localTarget = screenToLocal(sdx, sdy, fanAnglesRef.current[index]);
            const totalDx = dragLocalDelta.current.x + localTarget.x;
            const totalDy = dragLocalDelta.current.y + localTarget.y;

            elem.style.transition = "transform 0.15s ease-in";
            elem.style.transform = `translate(${totalDx}px, ${totalDy}px) scale(0.8)`;
            const capturedIndex = index;
            const capturedCard = card;
            setTimeout(() => {
                elem.style.transition = "";
                elem.style.transform = "";
                setDragCardIndex(null);
                playCard(capturedCard, capturedIndex);
            }, 150);
        } else {
            elem.style.transition = "transform 0.2s ease-out";
            elem.style.transform = "";
            setTimeout(() => {
                setDragCardIndex(null);
                elem.style.transition = "";
            }, 200);
        }
    };

    return (
        <div className="hand">
            <div
                ref={pitchZoneRef}
                className={`pitch-zone ${dragCardIndex !== null ? "pitch-zone--visible" : ""}`}
            >
                <span className="pitch-zone__label">⚾ Pitch here</span>
            </div>
            <div className="hand-cards-container" ref={containerRef}>
                {hand.map((card, index) => {
                    const fanAngle = fanAngles[index];
                    const zIndex = dragCardIndex === index ? 1000 : FAN_Z_INDICES[index];

                    if (card === "") {
                        return (
                            <div
                                key={index}
                                className="hand-card-slot hand-card-slot--empty"
                                style={{ "--fan-angle": `${fanAngle}deg`, zIndex } as React.CSSProperties}
                            />
                        );
                    }

                    const IconComponent = iconMap[card];
                    return (
                        <div
                            key={index}
                            className={`hand-card-slot${dragCardIndex === index ? " hand-card-slot--dragging" : ""}`}
                            style={{ "--fan-angle": `${fanAngle}deg`, zIndex } as React.CSSProperties}
                        >
                            <button
                                className={`hand-card${dragCardIndex === index ? " dragging" : ""}`}
                                onPointerDown={(e) => handlePointerDown(e, index)}
                                onPointerMove={(e) => handlePointerMove(e, index)}
                                onPointerUp={(e) => handlePointerUp(e, index)}
                                style={{ touchAction: "none" }}
                            >
                                {IconComponent && (
                                    <div className="hand-card-icon">
                                        <IconComponent size={30} color="black" />
                                    </div>
                                )}
                                <div className="hand-card-title">{card}</div>
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DisplayHand;
