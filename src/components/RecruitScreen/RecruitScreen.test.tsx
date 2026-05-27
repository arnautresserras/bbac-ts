import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import RecruitScreen from "./RecruitScreen";
import {
  POWER_SLUGGER,
  ZEN_MASTER,
  CONTACT_HITTER,
  AVERAGE_JOE,
} from "../../data/playerArchetypes";

const mockRecruits = [POWER_SLUGGER, ZEN_MASTER, CONTACT_HITTER];
const mockRoster = Array(9).fill(AVERAGE_JOE);

test("shows 3 recruit options in step 1", () => {
  render(<RecruitScreen recruits={mockRecruits} roster={mockRoster} onConfirm={jest.fn()} />);
  expect(screen.getByText("Power Slugger")).toBeInTheDocument();
  expect(screen.getByText("Zen Master")).toBeInTheDocument();
  expect(screen.getByText("Contact Hitter")).toBeInTheDocument();
});

test("clicking a recruit moves to the slot selection step", () => {
  render(<RecruitScreen recruits={mockRecruits} roster={mockRoster} onConfirm={jest.fn()} />);
  fireEvent.click(screen.getByText("Power Slugger"));
  expect(screen.getByText(/Place Power Slugger/)).toBeInTheDocument();
  expect(screen.getAllByText("Average Joe")).toHaveLength(9);
});

test("clicking a valid roster slot calls onConfirm with correct args", () => {
  const onConfirm = jest.fn();
  render(<RecruitScreen recruits={mockRecruits} roster={mockRoster} onConfirm={onConfirm} />);
  fireEvent.click(screen.getByText("Power Slugger"));
  fireEvent.click(screen.getAllByText("Average Joe")[0]);
  expect(onConfirm).toHaveBeenCalledWith(0, POWER_SLUGGER);
});

test("back button returns to step 1", () => {
  render(<RecruitScreen recruits={mockRecruits} roster={mockRoster} onConfirm={jest.fn()} />);
  fireEvent.click(screen.getByText("Power Slugger"));
  fireEvent.click(screen.getByText(/← Back/));
  expect(screen.getByText("Power Slugger")).toBeInTheDocument();
  expect(screen.getByText("Zen Master")).toBeInTheDocument();
});

test("non-Average Joe slots are disabled and do not call onConfirm", () => {
  const onConfirm = jest.fn();
  const mixedRoster = [
    POWER_SLUGGER,
    ...Array(8).fill(AVERAGE_JOE),
  ];
  render(<RecruitScreen recruits={mockRecruits} roster={mixedRoster} onConfirm={onConfirm} />);
  fireEvent.click(screen.getByText("Zen Master"));
  // The Power Slugger slot should be disabled
  const allSlotNames = screen.getAllByRole("button");
  // Find the locked Power Slugger slot button
  const lockedButton = allSlotNames.find(
    b => b.className.includes("recruit-slot--locked")
  );
  expect(lockedButton).toBeTruthy();
  fireEvent.click(lockedButton!);
  expect(onConfirm).not.toHaveBeenCalled();
});
