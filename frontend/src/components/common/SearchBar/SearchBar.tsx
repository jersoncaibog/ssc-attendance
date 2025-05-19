import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";

interface SearchBarProps {
  onSearch?: (value: string) => void;
}

export const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearch?.(value);
  };

  return (
    <div className={`relative ml-auto mr-3 sm:ml-0 sm:mr-auto`}>
      <div className="flex flex-row w-36 sm:w-60 items-center border border-border-dark px-3 py-1.5 gap-2 rounded-md focus-within:border-border-focus focus-within:ring-2 focus-within:ring-zinc-200 bg-background-light">
        <span className="text-textbox-placeholder text-xs">
          <SearchIcon sx={{ fontSize: "1rem" }} />
        </span>
        <input
          type="text"
          className="w-full outline-none text-xs bg-transparent"
          placeholder={"Search"}
          value={searchValue}
          onChange={handleSearch}
        />
      </div>
    </div>
  );
};
