"use client";
import { useEffect, useState, useRef } from "react";

interface TabsProps {
  tabs: string[];
}

const ChangeTab: React.FC<TabsProps> = ({ tabs }) => {
  return (
    <div className="flex gap-2 lg:mr-32">
      <div className="mt-2">
        <div className="shadow-custom border p-2 rounded-sm">
          {tabs.map((tab: any, index: number) => (
            <button>{tab.title[index]}</button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChangeTab;
