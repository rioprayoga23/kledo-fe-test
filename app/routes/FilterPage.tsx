import { useState } from "react";
import type { ChangeEvent, ReactNode, SelectHTMLAttributes } from "react";
import type { ShouldRevalidateFunctionArgs } from "react-router";
import { useSearchParams } from "react-router";
import type { Route } from "./+types/FilterPage";

type Province = {
  id: number | string;
  name: string;
};

type Regency = {
  id: number | string;
  province_id: number | string;
  name: string;
};

type District = {
  id: number | string;
  regency_id: number | string;
  name: string;
};

type LoaderData = {
  provincies?: Province[];
  regencies?: Regency[];
  districts?: District[];
};

type SelectOption = {
  label: string;
  value: string;
};

type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  icon?: ReactNode;
  options: SelectOption[];
};

type SelectConfig = {
  id: string;
  name: string;
  label: string;
  icon: ReactNode;
  value: string;
  options: SelectOption[];
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  disabled: boolean;
};

type BreadcrumbItemProps = {
  label: string;
  active: boolean;
};

export const meta = (_: Route.MetaArgs) => [
  { title: "Frontend Assessment" },
  { name: "description", content: "Frontend Assessment UI" },
];

export const clientLoader = async (): Promise<LoaderData> => {
  const response = await fetch("/data/indonesia_regions.json");

  if (!response.ok) {
    throw new Response("Failed to load Indonesia region data", {
      status: response.status,
      statusText: response.statusText,
    });
  }

  return (await response.json()) as LoaderData;
};

export const shouldRevalidate = ({
  currentUrl,
  nextUrl,
  defaultShouldRevalidate,
}: ShouldRevalidateFunctionArgs) => {
  if (
    currentUrl.pathname === nextUrl.pathname &&
    currentUrl.search !== nextUrl.search
  ) {
    return false;
  }

  return defaultShouldRevalidate;
};

const toId = (value: number | string) => String(value);

const withPlaceholder = (
  label: string,
  items: { id: number | string; name: string }[],
) => [
  { label, value: "" },
  ...items.map((item) => ({ label: item.name, value: toId(item.id) })),
];

const findSelected = <T extends { id: number | string }>(
  items: T[],
  selectedId: string,
) => {
  return items.find((item) => toId(item.id) === selectedId);
};

const SelectField = ({
  id,
  name,
  label,
  icon,
  options,
  className = "",
  ...props
}: SelectFieldProps) => {
  const fieldId = id ?? name;

  return (
    <div className={`mb-6 flex flex-col ${className}`.trim()}>
      <label
        htmlFor={fieldId}
        className="mb-2 text-[10px] font-normal uppercase tracking-wide text-slate-400"
      >
        {label}
      </label>

      <div className="relative">
        {icon ? (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            {icon}
          </div>
        ) : null}

        <select
          id={fieldId}
          name={name}
          className={`block w-full cursor-pointer appearance-none rounded-xl border border-black bg-white py-2.5 pr-10 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 ${icon ? "pl-9" : "px-3"}`}
          {...props}
        >
          {options.map((option, index) => {
            const isPlaceholder = index === 0 && option.value === "";

            return (
              <option
                key={`${option.value}-${option.label}`}
                value={option.value}
                disabled={isPlaceholder}
                hidden={isPlaceholder}
              >
                {option.label}
              </option>
            );
          })}
        </select>

        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

const DisplaySection = ({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: string;
  valueClassName: string;
}) => (
  <div className="flex flex-col items-center text-center">
    <h3 className="mb-3 text-[10px] font-normal uppercase tracking-[0.2em] text-[#3b82f6] md:text-xs">
      {label}
    </h3>
    <h2
      className={`font-semibold leading-none tracking-tight text-[#1a2533] ${valueClassName}`}
    >
      {value}
    </h2>
  </div>
);

const BreadcrumbItem = ({ label, active }: BreadcrumbItemProps) => (
  <>
    <span className="mx-2 text-slate-300">›</span>
    <span
      className={`font-normal tracking-wide ${active ? "text-[#3b82f6]" : "text-slate-400"}`}
    >
      {label}
    </span>
  </>
);

const Icons = {
  Globe: () => (
    <div className="rounded-full bg-[#eaf1fb] p-1.5 text-[#2c75e3]">
      <svg
        className="h-7 w-7"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.5"
          d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>
  ),
  Map: () => (
    <svg
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
      />
    </svg>
  ),
  City: () => (
    <svg
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
      />
    </svg>
  ),
  Location: () => (
    <svg
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  ),
  FilterSlash: () => (
    <svg
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M4 4l16 16"
      />
    </svg>
  ),
  ArrowDown: () => (
    <svg
      className="h-5 w-5 text-slate-300"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M19 14l-7 7m0 0l-7-7m7 7V3"
      />
    </svg>
  ),
};

export default function FilterPage({ loaderData }: Route.ComponentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    provincies: provinces = [],
    regencies = [],
    districts = [],
  } = loaderData;

  const selectedProvinceId = searchParams.get("province") ?? "";
  const selectedRegencyId = searchParams.get("regency") ?? "";
  const selectedDistrictId = searchParams.get("district") ?? "";

  const selectedProvince = findSelected(provinces, selectedProvinceId);
  const selectedRegency = findSelected(regencies, selectedRegencyId);
  const selectedDistrict = findSelected(districts, selectedDistrictId);

  const filteredRegencies = regencies.filter(
    (item) => toId(item.province_id) === selectedProvinceId,
  );
  const filteredDistricts = districts.filter(
    (item) => toId(item.regency_id) === selectedRegencyId,
  );

  const provinceOptions = withPlaceholder("Pilih Provinsi", provinces);
  const regencyOptions = withPlaceholder(
    "Pilih Kota/Kabupaten",
    filteredRegencies,
  );
  const districtOptions = withPlaceholder("Pilih Kecamatan", filteredDistricts);

  const setParam = (
    key: "province" | "regency" | "district",
    value: string,
  ) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    return next;
  };

  const handleProvinceChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const next = setParam("province", event.target.value);
    next.delete("regency");
    next.delete("district");
    setSearchParams(next);
  };

  const handleRegencyChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const next = setParam("regency", event.target.value);
    next.delete("district");
    setSearchParams(next);
  };

  const handleDistrictChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSearchParams(setParam("district", event.target.value));
  };

  const handleReset = () => {
    setSearchParams(new URLSearchParams());
  };

  const selectConfigs: SelectConfig[] = [
    {
      id: "province",
      name: "province",
      label: "Provinsi",
      icon: <Icons.Map />,
      value: selectedProvinceId,
      options: provinceOptions,
      onChange: handleProvinceChange,
      disabled: false,
    },
    {
      id: "regency",
      name: "regency",
      label: "Kota/Kabupaten",
      icon: <Icons.City />,
      value: selectedRegencyId,
      options: regencyOptions,
      onChange: handleRegencyChange,
      disabled: !selectedProvinceId,
    },
    {
      id: "district",
      name: "district",
      label: "Kecamatan",
      icon: <Icons.Location />,
      value: selectedDistrictId,
      options: districtOptions,
      onChange: handleDistrictChange,
      disabled: !selectedRegencyId,
    },
  ];

  const selectedSections: Array<{
    label: string;
    value: string;
    valueClassName: string;
  }> = [];

  for (const section of ["province", "regency", "district"] as const) {
    switch (section) {
      case "province":
        if (selectedProvince) {
          selectedSections.push({
            label: "Provinsi",
            value: selectedProvince.name,
            valueClassName: "text-5xl md:text-6xl lg:text-[68px]",
          });
        }
        break;
      case "regency":
        if (selectedRegency) {
          selectedSections.push({
            label: "Kota / Kabupaten",
            value: selectedRegency.name,
            valueClassName: "text-4xl md:text-5xl lg:text-[56px]",
          });
        }
        break;
      case "district":
        if (selectedDistrict) {
          selectedSections.push({
            label: "Kecamatan",
            value: selectedDistrict.name,
            valueClassName: "text-3xl md:text-4xl lg:text-5xl",
          });
        }
        break;
      default:
        break;
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col overflow-hidden bg-white font-sans md:flex-row">
      <aside className="sticky top-0 z-20 flex h-auto w-full shrink-0 flex-col border-slate-200 bg-[#f8f9fa] shadow-sm md:relative md:h-screen md:w-[280px] md:border-r md:shadow-none lg:w-[320px]">
        <div className="px-4 py-6 md:px-8">
          <div className="flex w-full items-center justify-between md:mb-10">
            <div className="flex items-center gap-4">
              <Icons.Globe />
              <h1 className="text-[15px] font-semibold tracking-tight text-[#1a2533]">
                Frontend Assessment
              </h1>
            </div>

            <button
              type="button"
              aria-label={isOpen ? "Tutup sidebar" : "Buka sidebar"}
              aria-expanded={isOpen}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 hover:text-slate-700 md:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className="relative h-4 w-5">
                <span className="absolute left-0 top-0 h-0.5 w-5 origin-center rounded-full bg-current" />
                <span className="absolute left-0 top-[7px] h-0.5 w-5 rounded-full bg-current" />
                <span className="absolute left-0 top-[14px] h-0.5 w-5 origin-center rounded-full bg-current" />
              </span>
            </button>
          </div>

          <div
            className={`${isOpen ? "block py-4" : "hidden py-0"} md:block md:py-0`}
          >
            <div className="min-h-0">
              <h2 className="mb-6 mt-4 text-[10px] uppercase tracking-wider text-slate-400 md:mt-0">
                Filter Wilayah
              </h2>

              {selectConfigs.map((config: SelectConfig, index: number) => (
                <SelectField
                  key={config.id}
                  id={config.id}
                  name={config.name}
                  label={config.label}
                  icon={config.icon}
                  value={config.value}
                  options={config.options}
                  onChange={config.onChange}
                  disabled={config.disabled}
                  className={index === 0 ? "" : "mt-6"}
                />
              ))}

              <button
                type="button"
                onClick={handleReset}
                className="mt-8 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#3b82f6] p-4 text-sm text-black shadow-sm hover:bg-slate-100 md:text-xs"
              >
                <span className="flex items-center">
                  <Icons.FilterSlash />
                </span>
                RESET
              </button>
            </div>
          </div>
        </div>
      </aside>

      <main className="relative flex h-auto w-full flex-1 flex-col items-center bg-[#f8f9fa] md:h-screen">
        <header className="breadcrumb z-10 flex w-full flex-wrap items-center border-b border-slate-200 bg-white p-4 text-xs font-normal md:absolute md:top-0 md:left-0 md:p-8">
          {selectedProvince ? (
            <>
              <span className="text-slate-400">Indonesia</span>
              <BreadcrumbItem
                label={selectedProvince.name}
                active={!selectedRegency}
              />
            </>
          ) : null}

          {selectedRegency ? (
            <BreadcrumbItem
              label={selectedRegency.name}
              active={!selectedDistrict}
            />
          ) : null}

          {selectedDistrict ? (
            <BreadcrumbItem label={selectedDistrict.name} active />
          ) : null}
        </header>

        <div className="flex w-full flex-1 flex-col items-center justify-center gap-6 px-6 py-6 md:px-8 lg:gap-8">
          {selectedSections.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm italic text-slate-400">
              Silakan pilih provinsi terlebih dahulu
            </div>
          ) : (
            selectedSections.map((section, index) => (
              <div key={section.label} className="contents">
                {index > 0 ? (
                  <div className="flex justify-center opacity-60">
                    <Icons.ArrowDown />
                  </div>
                ) : null}
                <DisplaySection
                  label={section.label}
                  value={section.value}
                  valueClassName={section.valueClassName}
                />
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
