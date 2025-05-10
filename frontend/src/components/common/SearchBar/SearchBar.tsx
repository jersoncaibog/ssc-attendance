import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";

interface SearchBarProps {
  className?: string;
  onSearch?: (value: string) => void;
}

export const SearchBar = ({
  onSearch,
}: SearchBarProps) => {
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearch?.(value);
  };

  return (
    <div className={`relative`}>
      <div className="flex flex-row w-40 items-center border border-border-dark px-3 py-1 gap-2 rounded-md focus-within:border-border-focus">
        <span className="text-textbox-placeholder">
          <SearchIcon fontSize="small" />
        </span>
        <input
          type="text"
          className="w-full outline-none text-sm"
          placeholder={"Search"}
          value={searchValue}
          onChange={handleSearch}
        />
      </div>
    </div>
  );
};
