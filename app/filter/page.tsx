import SportsDropdown from "@/components/Dropdown/Dropdown"; // ✅ Ensure correct import path

export default function Page() {
  console.log("Rendering /filters/page.tsx...");

  return (
    <div style={{marginTop: '80px'}}>
      <SportsDropdown />
    </div>
  );
}