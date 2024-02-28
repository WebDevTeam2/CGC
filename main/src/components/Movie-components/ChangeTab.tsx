"use client";
import { useEffect, useState, useRef } from "react";

interface Tab {
  title: string;
}

interface TabsProps {
  tabs: Tab[];
  setSelectedTab: React.Dispatch<React.SetStateAction<number>>;
}

const ChangeTab: React.FC<TabsProps> = ({ tabs, setSelectedTab }) => {
  const [activeTab, setActiveTab] = useState(0);
  const firstButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setActiveTab(0);
  }, []);

  return (
    <div className="flex gap-2 lg:mr-32">
      <div className="mt-2">
        <div className="flex">
          {tabs.map((tab: Tab, index: number) => (
            <button
              key={index}
              ref={index === 0 ? firstButtonRef : null}
              onClick={() => {
                setSelectedTab(index);
              }}
              className={`${
                index === activeTab ? "shadow-none" : "shadow-custom "
              } transition duration-700 ease-in-out rounded-sm p-2 hover:bg-[#9c9c9c]`}
            >
              {tab.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChangeTab;
