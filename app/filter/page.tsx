"use client"; // Ensures the entire page runs on the client

import React, { useState, useEffect } from "react";
import Dropdown from "@/components/Dropdown/Dropdown"; 
import sportsData from "@/data/sportsData.json"; 
import locationData from "@/data/locations.json"; 

export default function Page() {
  return (
    <div style={{ maxWidth: "400px", margin: "40px" }}>
      <h2 style={{ display: 'flex' }}>Sports & Clubs<em style={{ marginLeft: 'auto', opacity: 0.5 }}>Test with "Arch"</em></h2>
      <Dropdown data={sportsData} placeholder="Search for a sport or club..." style={{ marginBottom: "20px" }} />

      <h2 style={{ display: 'flex' }}>Locations<em style={{ marginLeft: 'auto', opacity: 0.5 }}>Test with "Syd"</em></h2>
      <Dropdown data={locationData} placeholder="Search for a state or suburb..." />
    </div>
  );
}