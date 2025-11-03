"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import useArbitrageRealtime from "../hooks/useArbitrageRealtime";

import {
  calculateBackVsBackStakes,
  calculateBackVsLayStakes,
} from "../hooks/useStakes";

import {
  ALL_SPORT_FILTER_KEY,
  getBaseSportFilters,
  resolveSportFilterOption,
  type SportFilterOption,
} from "../utils/constants";
import BankSidebar from "./layout/BankSidebar";
import FiltersToolbar from "./layout/FiltersToolbar";
import ArbitrageCard from "./cards/ArbitrageCard";
import type { Arbitrage, StakeResult } from "../utils/types";
import { useLanguageContext } from "@/providers/LanguageProvider";
import { useAppTranslations } from "@/lib/i18n";

type SelectOption = { value: string; label: string };

const DEFAULT_SORT = "profit-desc";

const matchLabel = (arb: Arbitrage) => `${arb.home_team} vs ${arb.away_team}`;

const getArbitrageKey = (arb: Arbitrage) =>
  `${arb.home_team} vs ${arb.away_team} @ ${arb.match_date}`;

export default function ArbitrageList() {
  const { arbitrages, status, lastDelta } = useArbitrageRealtime();
  const { language } = useLanguageContext();
  const arbitrageCopy = useAppTranslations("arbitrage");
  const {
    currency,
    mobile,
    defaults,
    sortOptions: sortCopy,
    filtersToolbar: filtersCopy,
    bankSidebar: bankCopy,
    list: listCopy,
    card: cardCopy,
  } = arbitrageCopy;
  const collator = useMemo(
    () =>
      new Intl.Collator(currency.locale, {
        sensitivity: "base",
      }),
    [currency.locale]
  );
  const baseFilters = useMemo(() => getBaseSportFilters(language), [language]);
  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat(currency.locale, {
        style: "currency",
        currency: currency.currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    [currency.currency, currency.locale]
  );
  const formatCurrencyValue = useCallback(
    (value?: number | null) => {
      if (typeof value !== "number" || Number.isNaN(value)) {
        return "--";
      }
      return currencyFormatter.format(value);
    },
    [currencyFormatter]
  );
  const [showOverlay, setShowOverlay] = useState(true);
  const [fadeClass, setFadeClass] = useState("fade-in");
  const [bank, setBank] = useState<number>(100);
  const [selectedSport, setSelectedSport] = useState<string>(ALL_SPORT_FILTER_KEY);
  const [selectedBookmaker, setSelectedBookmaker] = useState<string>("All");
  const [minProfit, setMinProfit] = useState<string>("");
  const [betType, setBetType] = useState<string>("ALL");
  const [sortOption, setSortOption] = useState<string>(DEFAULT_SORT);
  const [searchQuery, setSearchQuery] = useState("");
  const [isBankOpen, setIsBankOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const isProfitSort = sortOption.startsWith("profit");
  const cardLabels = useMemo(
    () => ({
      homePrefix: cardCopy.homePrefix,
      awayPrefix: cardCopy.awayPrefix,
      ariaLabel: (id: string | number) =>
        cardCopy.ariaLabel.replace("{{id}}", String(id)),
      betInfo: cardCopy.betInfo,
      newBadge: cardCopy.newBadge,
    }),
    [cardCopy]
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsBankOpen(false);
        setIsFiltersOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const calculateStakes = useCallback(
    (arb: Arbitrage): StakeResult => {
      if (arb.type === "Back vs Lay") {
        return calculateBackVsLayStakes(bank, arb.back_odds ?? 0, arb.lay_odds ?? 0);
      }

      if (arb.type === "Back vs Back") {
        const homeOdds = arb.home?.odds ?? 0;
        const awayOdds = arb.away?.odds ?? 0;
        return calculateBackVsBackStakes(bank, homeOdds, awayOdds);
      }

      return {};
    },
    [bank]
  );

  useEffect(() => {
    if (status === "open" && arbitrages.length > 0) {
      setFadeClass("fade-out");
      const timer = setTimeout(() => setShowOverlay(false), 300);
      return () => clearTimeout(timer);
    }

    if (status === "connecting") {
      setShowOverlay(true);
      setFadeClass("fade-in");
    }

    return () => undefined;
  }, [status, arbitrages]);

  const sportOptions = useMemo(() => {
    const options = new Map<string, SportFilterOption>();
    baseFilters.forEach((filter) => options.set(filter.key, filter));

    arbitrages.forEach((arb) => {
      const option = resolveSportFilterOption(arb.sport_key, arb.sport, language);
      if (!options.has(option.key)) {
        options.set(option.key, option);
      }
    });

    const allOption = options.get(ALL_SPORT_FILTER_KEY) ?? baseFilters[0];
    const dynamicOptions = Array.from(options.values()).filter(
      (option) => option.key !== ALL_SPORT_FILTER_KEY
    );
    dynamicOptions.sort((a, b) => collator.compare(a.name, b.name));
    return [allOption, ...dynamicOptions];
  }, [arbitrages, baseFilters, language, collator]);

  useEffect(() => {
    if (!sportOptions.some((option) => option.key === selectedSport)) {
      setSelectedSport(ALL_SPORT_FILTER_KEY);
    }
  }, [sportOptions, selectedSport]);

  const activeSportOption = useMemo(
    () =>
      sportOptions.find((option) => option.key === selectedSport) ??
      baseFilters[0],
    [sportOptions, selectedSport, baseFilters]
  );

  const bookmakerOptions = useMemo<SelectOption[]>(() => {
    const set = new Set<string>();

    arbitrages.forEach((arb) => {
      [
        arb.back_bookmaker,
        arb.lay_bookmaker,
        arb.home?.bookmaker,
        arb.away?.bookmaker,
      ]
        .filter(Boolean)
        .forEach((bookmaker) => set.add((bookmaker as string).trim()));
    });

    const sorted = Array.from(set).sort((a, b) =>
      collator.compare(a.toLowerCase(), b.toLowerCase())
    );

    return [
      { value: "All", label: defaults.bookmakerAll },
      ...sorted.map((value) => ({ value, label: value })),
    ];
  }, [arbitrages, collator, defaults.bookmakerAll]);

  useEffect(() => {
    if (!bookmakerOptions.some((option) => option.value === selectedBookmaker)) {
      setSelectedBookmaker("All");
    }
  }, [bookmakerOptions, selectedBookmaker]);

  const betTypeOptions = useMemo<SelectOption[]>(() => {
    const set = new Set<string>();
    arbitrages.forEach((arb) => {
      if (arb.type) {
        set.add(arb.type);
      }
    });

    const sorted = Array.from(set).sort((a, b) => collator.compare(a, b));

    return [
      { value: "ALL", label: defaults.betTypesAll },
      ...sorted.map((value) => ({ value, label: value })),
    ];
  }, [arbitrages, collator, defaults.betTypesAll]);

  const sortOptions = useMemo<SelectOption[]>(
    () => [
      { value: "profit-desc", label: sortCopy.profitDesc },
      { value: "profit-asc", label: sortCopy.profitAsc },
      { value: "match-az", label: sortCopy.matchAz },
      { value: "match-za", label: sortCopy.matchZa },
    ],
    [sortCopy.profitDesc, sortCopy.profitAsc, sortCopy.matchAz, sortCopy.matchZa]
  );

  const hasActiveFilters = useMemo(() => {
    const hasBookmaker = selectedBookmaker !== "All";
    const hasProfit = minProfit.trim().length > 0;
    const hasType = betType !== "ALL";
    const hasSport = selectedSport !== ALL_SPORT_FILTER_KEY;
    const hasSearch = searchQuery.trim().length > 0;
    return hasBookmaker || hasProfit || hasType || hasSport || hasSearch;
  }, [selectedBookmaker, minProfit, betType, selectedSport, searchQuery]);

  const handleResetFilters = useCallback(() => {
    setSelectedBookmaker("All");
    setMinProfit("");
    setBetType("ALL");
    setSortOption(DEFAULT_SORT);
    setSelectedSport(ALL_SPORT_FILTER_KEY);
    setSearchQuery("");
  }, []);

  const matchesBookmaker = useCallback((arb: Arbitrage, bookmaker: string) => {
    const normalized = bookmaker.toLowerCase();
    return [
      arb.back_bookmaker,
      arb.lay_bookmaker,
      arb.home?.bookmaker,
      arb.away?.bookmaker,
    ]
      .filter(Boolean)
      .map((value) => (value as string).toLowerCase())
      .some((value) => value.includes(normalized));
  }, []);
  const normalizeSearchText = useCallback((value: string) =>
    value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim(),
  []);

  const matchesSearchQuery = useCallback(
    (arb: Arbitrage, query: string) => {
      if (!query) {
        return true;
      }

      const searchableStrings: string[] = [];
      const visited = new Set<unknown>();

      const visit = (value: unknown) => {
        if (!value || visited.has(value)) {
          return;
        }

        if (typeof value === "string") {
          searchableStrings.push(value);
          return;
        }

        if (Array.isArray(value)) {
          value.forEach((item) => visit(item));
          return;
        }

        if (typeof value === "object") {
          visited.add(value);
          Object.entries(value as Record<string, unknown>).forEach(
            ([key, nestedValue]) => {
              if (key.toLowerCase().includes("bookmaker")) {
                return;
              }
              visit(nestedValue);
            }
          );
        }
      };

      visit(arb);

      const normalizedQuery = normalizeSearchText(query);
      return searchableStrings.some((text) =>
        normalizeSearchText(text).includes(normalizedQuery)
      );
    },
    [normalizeSearchText]
  );

  const processedArbitrages = useMemo(() => {
    const minProfitValue = Number.parseFloat(minProfit.replace(",", "."));
    const shouldFilterByProfit = !Number.isNaN(minProfitValue);
    const normalizedQuery = normalizeSearchText(searchQuery);

    let list = arbitrages;

    if (activeSportOption.key !== ALL_SPORT_FILTER_KEY) {
      list = list.filter((arb) =>
        activeSportOption.matcher(arb.sport_key, arb.sport)
      );
    }

    if (selectedBookmaker !== "All") {
      list = list.filter((arb) => matchesBookmaker(arb, selectedBookmaker));
    }

    if (shouldFilterByProfit) {
      list = list.filter((arb) => arb.profit_percent >= minProfitValue);
    }

    if (betType !== "ALL") {
      list = list.filter((arb) => arb.type === betType);
    }

    if (normalizedQuery) {
      list = list.filter((arb) => matchesSearchQuery(arb, normalizedQuery));
    }

    const sorted = [...list];
    switch (sortOption) {
      case "profit-asc":
        sorted.sort((a, b) => a.profit_percent - b.profit_percent);
        break;
      case "match-az":
        sorted.sort((a, b) => collator.compare(matchLabel(a), matchLabel(b)));
        break;
      case "match-za":
        sorted.sort((a, b) => collator.compare(matchLabel(b), matchLabel(a)));
        break;
      case "profit-desc":
      default:
        sorted.sort((a, b) => b.profit_percent - a.profit_percent);
        break;
    }

    return sorted;
  }, [
    arbitrages,
    activeSportOption,
    selectedBookmaker,
    matchesBookmaker,
    minProfit,
    betType,
    sortOption,
    normalizeSearchText,
    searchQuery,
    matchesSearchQuery,
    collator,
  ]);

  const profitStream = useMemo(() => {
    if (!isProfitSort) {
      return [];
    }

    const rows: Array<{
      id: string;
      showHeader: boolean;
      arbitrage: Arbitrage;
    }> = [];

    let lastMatchKey = "";
    processedArbitrages.forEach((arb) => {
      const matchKey = getArbitrageKey(arb);
      const showHeader = matchKey !== lastMatchKey;
      rows.push({
        id: `${matchKey}-${arb.id_arb}`,
        showHeader,
        arbitrage: arb,
      });
      lastMatchKey = matchKey;
    });

    return rows;
  }, [isProfitSort, processedArbitrages]);

  const grouped = useMemo(() => {
    if (isProfitSort) {
      return null;
    }

    const map = new Map<string, Arbitrage[]>();
    processedArbitrages.forEach((arb) => {
      const key = getArbitrageKey(arb);
      const group = map.get(key);
      if (group) {
        group.push(arb);
      } else {
        map.set(key, [arb]);
      }
    });
    return map;
  }, [isProfitSort, processedArbitrages]);

  const hasArbitrages = processedArbitrages.length > 0;
  const currentSportName = activeSportOption?.name || selectedSport;
  const isInitialLoading =
    status === "connecting" || (status === "open" && arbitrages.length === 0);

  const LoadingCard = () => (
    <div className="match-container fade-in">
      <div className="match-header shimmer">
        <div className="h-5 w-2/3 bg-gray-700 rounded mb-2"></div>
        <div className="h-3 w-1/3 bg-gray-700 rounded"></div>
      </div>
      <div className="arb-list-container">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="arbitrage-card shimmer rounded-xl border border-gray-700 bg-gray-800 p-4 shadow-md animate-pulse"
          >
            <div className="h-4 bg-gray-600 rounded w-3/4 mb-3"></div>
            <div className="h-3 bg-gray-700 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-700 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMatchHeader = (arb: Arbitrage, extraClass = "") => {
    const sportOption = resolveSportFilterOption(arb.sport_key, arb.sport, language);
    const SportIcon = sportOption.icon;

    return (
      <div className={`match-header ${extraClass}`.trim()}>
        <div className="match-header__badge" aria-hidden="true">
          <SportIcon />
        </div>
        <div className="match-header__content">
          <h3>
            {arb.home_team} vs {arb.away_team}
          </h3>
          <p>
            <span className="match-header__sport-name">{sportOption.name}</span>
            <span className="match-header__dot" aria-hidden="true">
              •
            </span>
            <span>{arb.match_date}</span>
          </p>
        </div>
      </div>
    );
  };

  return (
    <>
      {(isBankOpen || isFiltersOpen) && (
        <div
          className="backdrop"
          onClick={() => {
            setIsBankOpen(false);
            setIsFiltersOpen(false);
          }}
          aria-hidden="true"
        />
      )}

      <div className="main-layout">
        <BankSidebar
          bank={bank}
          onBankChange={setBank}
          isSidebarOpen={isBankOpen}
          setIsSidebarOpen={setIsBankOpen}
          copy={bankCopy}
          currencySymbol={currency.symbol}
        />

        <main className="content-area">
          <div className="content-area__mobile-actions">
            <button
              type="button"
              className="content-area__toggle"
              onClick={() => setIsFiltersOpen(true)}
              aria-controls="advanced-filters"
              aria-expanded={isFiltersOpen}
            >
              <span aria-hidden="true">🎛️</span>
              <span>{mobile.filters}</span>
            </button>
            <button
              type="button"
              className="content-area__toggle"
              onClick={() => setIsBankOpen(true)}
              aria-controls="bank-sidebar"
              aria-expanded={isBankOpen}
            >
              <span aria-hidden="true">💰</span>
              <span>{mobile.bank}</span>
            </button>
          </div>

          <FiltersToolbar
            bookmakerOptions={bookmakerOptions}
            selectedBookmaker={selectedBookmaker}
            onBookmakerChange={setSelectedBookmaker}
            minProfit={minProfit}
            onMinProfitChange={setMinProfit}
            betType={betType}
            betTypeOptions={betTypeOptions}
            onBetTypeChange={setBetType}
            sortOption={sortOption}
            sortOptions={sortOptions}
            onSortOptionChange={setSortOption}
            onReset={handleResetFilters}
            hasActiveFilters={hasActiveFilters}
            sportOptions={sportOptions}
            selectedSport={selectedSport}
            onSportChange={setSelectedSport}
            isMobileOpen={isFiltersOpen}
            onCloseMobile={() => setIsFiltersOpen(false)}
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            copy={filtersCopy}
          />

          <div className="arbitrage-panel">
            <h2 className="panel-title">
              {listCopy.heading}
              {selectedSport !== ALL_SPORT_FILTER_KEY
                ? ` ${listCopy.sportSuffix} ${currentSportName}`
                : ""}
            </h2>

            {isInitialLoading && (
              <div className="text-center text-gray-400 mt-10">
                <LoadingCard />
                <p className="mt-6 text-sm opacity-70">{listCopy.loadingLive}</p>
              </div>
            )}

            {!isInitialLoading && !hasArbitrages && (
              <p className="no-arbs-message">
                {hasActiveFilters || selectedSport !== ALL_SPORT_FILTER_KEY
                  ? listCopy.noResultsFiltered
                  : listCopy.noResults}
              </p>
            )}

            {isProfitSort && (
              <div className="match-stream">
                {profitStream.map(({ id, arbitrage, showHeader }) => {
                  const stakes = calculateStakes(arbitrage);
                  return (
                    <div key={id} className="match-stream__item">
                      {showHeader && (
                        <div className="fade-in">
                          {renderMatchHeader(
                            arbitrage,
                            "match-header--inline"
                          )}
                        </div>
                      )}
                      <div className="match-stream__card">
                        <ArbitrageCard
                          arb={arbitrage}
                          stakes={stakes}
                          deltaState={
                            lastDelta?.new?.includes(arbitrage.id_arb)
                              ? "new"
                              : lastDelta?.updated?.includes(arbitrage.id_arb)
                              ? "updated"
                              : undefined
                          }
                          labels={cardLabels}
                          formatCurrency={formatCurrencyValue}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {!isProfitSort &&
              grouped &&
              Array.from(grouped.entries()).map(([match, arbs]) => (
                <div key={match} className="match-container">
                  <div className="fade-in">
                    {renderMatchHeader(arbs[0])}
                  </div>

                  <div className="arb-list-container">
                    {arbs.map((arb) => {
                      const stakes = calculateStakes(arb);
                      return (
                        <ArbitrageCard
                          key={arb.id_arb}
                          arb={arb}
                          stakes={stakes}
                          deltaState={
                            lastDelta?.new?.includes(arb.id_arb)
                              ? "new"
                              : lastDelta?.updated?.includes(arb.id_arb)
                              ? "updated"
                              : undefined
                          }
                          labels={cardLabels}
                          formatCurrency={formatCurrencyValue}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
          </div>
        </main>
      </div>

      {showOverlay && status === "connecting" && (
        <div className={`loading-overlay ${fadeClass}`}>
          <h2 style={{ color: "var(--color-text-accent)", marginBottom: "1.5rem" }}>
            {listCopy.loadingOverlay}
          </h2>
        </div>
      )}
    </>
  );
}
