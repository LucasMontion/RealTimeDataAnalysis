import { useEffect, useRef, useState } from "react";

const SearchableDropdown = ({
    symbols,
    label,
    id,
    selectedVal,
    handleChange
}) => {
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const inputRef = useRef(null);
    const [symbolList, setSymbolList] = useState([]);
    


    useEffect(() => {
        document.addEventListener("click", toggle);
        return () => document.removeEventListener("click", toggle);
    }, []);

    const selectSymbol = (symbol) => {
        setQuery(() => "");
        handleChange(symbol[label]);
        setIsOpen((isOpen) => !isOpen);
    };

    function toggle(e) {
        setIsOpen(e && e.target === inputRef.current);
    }

    const getDisplayValue = () => {
        if (query) return query;
        if (selectedVal) return selectedVal;

        return "";
    };

    const filter = (symbols) => {
        console.log('Symbols');
        console.log(symbols);
        return symbols.filter(
            (symbol) => symbol[label].toLowerCase().indexOf(query.toLowerCase()) > -1
        );
    };


    return (
        <div className="dropdown">
            <div className="control">
                <div className="selected-value">
                    <input
                        ref={inputRef}
                        type="text"
                        value={getDisplayValue()}
                        name="searchTerm"
                        onChange={(e) => {
                            setQuery(e.target.value);
                            handleChange(null);
                        }}
                        onClick={toggle}
                    />
                </div>
                <div className={`arrow ${isOpen ? "open" : ""}`}></div>
            </div>

            <div className={`symbols ${isOpen ? "open" : ""}`}>
                {filter(symbols).map((symbol, index) => {
                    return (
                        <div
                            onClick={() => selectSymbol(symbol)}
                            className={`symbol ${symbol[label] === selectedVal ? "selected" : ""
                                }`}
                            key={`${id}-${index}`}
                        >
                            {symbol[label]}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SearchableDropdown;