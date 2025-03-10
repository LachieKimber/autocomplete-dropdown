"use client"; // ✅ Ensures the entire page runs on the client

import React, { useState, useEffect } from "react";
import Dropdown from "@/components/Dropdown/Dropdown"; // ✅ Direct import (NO dynamic import!)

const sportsData = [
  { label: "Archery", value: "archery", isCategory: true },
  {
    label: "Archery Clubs",
    value: "archery_clubs",
    options: [
      { label: "Armidale Archers", value: "armidale_archers", parent: "Archery" },
      { label: "Bellingen Archers", value: "bellingen_archers", parent: "Archery" },
      { label: "Coast Archers", value: "coast_archers", parent: "Archery" },
    ],
  },
  { label: "Golf", value: "golf", isCategory: true },
  {
    label: "Golf Clubs",
    value: "golf_clubs",
    options: [
      { label: "Sydney Golf Club", value: "sydney_golf_club", parent: "Golf" },
      { label: "Wollombi Archibald Golf Club", value: "wollombi_archibald_golf_club", parent: "Golf" },
    ],
  },
  { label: "Tennis", value: "tennis", isCategory: true },
  {
    label: "Tennis Clubs",
    value: "tennis_clubs",
    options: [{ label: "Melbourne Tennis Academy", value: "melbourne_tennis", parent: "Tennis" }],
  },
];

const locationData = [
  { label: "New South Wales", value: "nsw", isCategory: true },
  {
    label: "NSW Suburbs",
    value: "nsw_suburbs",
    options: [
      { label: "Sydney, 2000", value: "sydney_2000", parent: "New South Wales" },
      { label: "Sydney Olympic Park, 2027", value: "sydney_olympic_park_2027", parent: "New South Wales" },
      { label: "Sydenham, 2040", value: "sydenham_2040", parent: "New South Wales" },
    ],
  },
  { label: "Queensland", value: "qld", isCategory: true },
  {
    label: "QLD Suburbs",
    value: "qld_suburbs",
    options: [{ label: "Coorparoo, 4151", value: "coorparoo_4151", parent: "Queensland" }],
  },
];

export default function Page() {
  return (
    <div style={{ maxWidth: "480px", margin: "40px" }}>
      <h2>Sports & Clubs</h2>
      <Dropdown data={sportsData} placeholder="Search for a sport or club..." style={{ marginBottom: "20px" }} />

      <h2>Locations</h2>
      <Dropdown data={locationData} placeholder="Search for a state or suburb..." />
    </div>
  );
}