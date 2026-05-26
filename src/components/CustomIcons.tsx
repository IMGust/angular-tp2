import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

// 1. RADIADOR (Radiator)
// A flat core structure with horizontal tubes, vertical fins, and technical fittings.
export const RadiatorIcon: React.FC<IconProps> = ({ size = 24, className, ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Top Tank */}
      <rect x="3" y="4" width="18" height="3" rx="0.5" />
      {/* Bottom Tank */}
      <rect x="3" y="17" width="18" height="3" rx="0.5" />
      {/* Core Cooling Tubes */}
      <line x1="6" y1="7" x2="6" y2="17" />
      <line x1="9" y1="7" x2="9" y2="17" strokeDasharray="1 1" />
      <line x1="12" y1="7" x2="12" y2="17" />
      <line x1="15" y1="7" x2="15" y2="17" strokeDasharray="1 1" />
      <line x1="18" y1="7" x2="18" y2="17" />
      {/* Top Inlet Hose Connector */}
      <path d="M5 2V4" />
      <path d="M7 2V4" />
      {/* Bottom Outlet Connector */}
      <path d="M17 20V22" />
      <path d="M19 20V22" />
      {/* Center Pressure Cap */}
      <path d="M11 2H13" />
      <path d="M12 2V4" />
    </svg>
  );
};

// 2. MOTOR (Engine)
// A schematic profile of an engine block showing the dual overhead cams, cylinders, and oil pan.
export const EngineIcon: React.FC<IconProps> = ({ size = 24, className, ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Cam Covers */}
      <circle cx="7" cy="6" r="2.5" />
      <circle cx="17" cy="6" r="2.5" />
      <line x1="9.5" y1="6" x2="14.5" y2="6" />
      
      {/* Cylinder Block Outer Shell */}
      <path d="M4 8.5H20V15H17.5V18.5H6.5V15H4V8.5Z" />
      
      {/* Cylinder/Piston Indications */}
      <line x1="9" y1="10" x2="9" y2="14" />
      <line x1="12" y1="10" x2="12" y2="14" strokeDasharray="2 1" />
      <line x1="15" y1="10" x2="15" y2="14" />

      {/* Flywheel / Pulley connection */}
      <circle cx="12" cy="18.5" r="1.5" />
    </svg>
  );
};

// 3. VEÍCULO (Vehicle)
// A sleek, aerodynamic technical profile outline of a sportscar.
export const VehicleIcon: React.FC<IconProps> = ({ size = 24, className, ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Sportscar Contour */}
      <path d="M2 15H4.5C4.8 13.5 6 12.5 7.5 12.5C9 12.5 10.2 13.5 10.5 15H13.5C13.8 13.5 15 12.5 16.5 12.5C18 12.5 19.2 13.5 19.5 15H22V13.5C22 12 21 11.5 20 11L17.5 9H11.5L8.5 6.5H5.5L3.5 10L2 12V15Z" />
      
      {/* Front Wheel */}
      <circle cx="7.5" cy="15" r="2.5" />
      <circle cx="7.5" cy="15" r="1" />

      {/* Rear Wheel */}
      <circle cx="16.5" cy="15" r="2.5" />
      <circle cx="16.5" cy="15" r="1" />

      {/* Cabin Window Divider */}
      <path d="M8.5 6.5V11" />
      <path d="M11.5 9V11" />
      <line x1="5.5" y1="10" x2="8.5" y2="10" />
    </svg>
  );
};

// 4. SUPERCHARGER
// A technical diagram representing the supercharger casing, drive belt gear pulley, and dual screws inside.
export const SuperchargerIcon: React.FC<IconProps> = ({ size = 24, className, ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Housing shape */}
      <path d="M4 6H16C17.1 6 18 6.9 18 8V16C18 17.1 17.1 18 16 18H4C2.9 18 2 17.1 2 16V8C2 6.9 2.9 6H4Z" />
      
      {/* Drive Shaft & Pulley Belt System */}
      <rect x="18" y="10" width="4" height="4" rx="0.5" />
      <line x1="20" y1="6" x2="20" y2="18" strokeDasharray="2 2" />

      {/* Twin Screw Rotors Inside (Overlapping spiral/wavy contours) */}
      <path d="M5 10C7 10 7 14 9 14C11 14 11 10 13 10C15 10 15 14 17 14" />
      <path d="M5 14C7 14 7 10 9 10C11 10 11 14 13 14C15 14 15 10 17 10" opacity="0.6" strokeDasharray="1 1" />
      <line x1="4" y1="12" x2="16" y2="12" />
    </svg>
  );
};

// 5. TURBO
// Snail shell impeller outline with an inlet, outlet flange, and turbine blade wheel in the center.
export const TurboIcon: React.FC<IconProps> = ({ size = 24, className, ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Snail housing exterior contour */}
      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C14 22 17.5 21 19 19.5L14 14.5M12 2C15.5 2 18.5 4.5 19.5 8C20 9 22 9.5 22 11V14.5C22 16.5 20.5 18 18.5 18H17" />
      
      {/* Central Impeller / Compressor Wheel */}
      <circle cx="12" cy="12" r="3.5" />
      <circle cx="12" cy="12" r="1" />
      
      {/* Impeller Blades */}
      <line x1="12" y1="8.5" x2="12" y2="15.5" />
      <line x1="8.5" y1="12" x2="15.5" y2="12" />
      <line x1="9.5" y1="9.5" x2="14.5" y2="14.5" />
      <line x1="14.5" y1="9.5" x2="9.5" y2="14.5" />
    </svg>
  );
};

// Map strings to Icon components for easy dynamic rendering
export const getCategoryIcon = (category: string, size = 20, className = "") => {
  switch (category.toLowerCase()) {
    case "radiador":
      return <RadiatorIcon size={size} className={className} />;
    case "motor":
      return <EngineIcon size={size} className={className} />;
    case "veículo":
    case "veiculo":
      return <VehicleIcon size={size} className={className} />;
    case "supercharger":
      return <SuperchargerIcon size={size} className={className} />;
    case "turbo":
      return <TurboIcon size={size} className={className} />;
    default:
      return null;
  }
};
