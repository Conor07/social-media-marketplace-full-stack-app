import React from "react";

type FooterProps = {};

const Footer: React.FC<FooterProps> = ({}) => {
  return (
    <footer className="w-full bg-white shadow-inner p-4 text-center">
      <span className="text-sm text-gray-500">
        &copy; Conor Talbot {new Date().getFullYear()}
      </span>
    </footer>
  );
};

export default Footer;
