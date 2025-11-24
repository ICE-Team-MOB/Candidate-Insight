import { useState } from "react";
import { useHRRequirements } from "../context/context";

const HRrequirements = () => {
  const {
    education,
    sector,
    experience,
    workFormat,
    setEducation,
    setSector,
    setExperience,
    setWorkFormat,
    resetRequirements,
  } = useHRRequirements();

  const [draftEducation, setDraftEducation] = useState(education || "");
  const [draftSector, setDraftSector] = useState(sector || "");
  const [draftExperience, setDraftExperience] = useState(experience || "");
  const [draftWorkFormat, setDraftWorkFormat] = useState(workFormat || "");

  const educationOptions = [
    { label: "Початкова освіта", value: "primary_education" },
    { label: "Базова середня освіта (основна школа)", value: "basic_secondary_education" },
    { label: "Повна загальна середня освіта (старша школа)", value: "complete_secondary_education" },
    { label: "Професійна (професійно-технічна) освіта", value: "vocational_education" },
    { label: "Фаховий молодший бакалавр", value: "junior_bachelor" },
    { label: "Бакалавр", value: "bachelor" },
    { label: "Магістр", value: "master" },
    { label: "Доктор філософії (PhD)", value: "phd" },
    { label: "Доктор наук", value: "doctor_of_science" },
  ];

  const sectorOptions = [
    { label: "IT / Розробка ПЗ", value: "it" },
    { label: "Фінанси / Банківська справа", value: "finance" },
    { label: "HR / Рекрутинг", value: "hr" },
    { label: "Маркетинг / PR", value: "marketing" },
    { label: "Продажі", value: "sales" },
    { label: "Виробництво / Інженерія", value: "engineering" },
    { label: "Освіта / Наука", value: "education" },
    { label: "Медицина / Соціальна сфера", value: "healthcare" },
    { label: "Інше", value: "other" },
  ];

  const experienceOptions = [
    { label: "Без досвіду", value: "no_experience" },
    { label: "0–1 року", value: "0_1" },
    { label: "1–3 роки", value: "1_3" },
    { label: "3–5 років", value: "3_5" },
    { label: "5+ років", value: "5_plus" },
  ];

  const workFormatOptions = [
    { label: "Офіс", value: "office" },
    { label: "Віддалено", value: "remote" },
    { label: "Гібридний формат", value: "hybrid" },
  ];

  const selectBaseClasses =
    "w-full py-2.5 pl-3 pr-8 border border-gray-200/70 rounded-xl " +
    "focus:ring-2 focus:ring-blue-400 focus:border-blue-400 " +
    "transition-all duration-200 bg-white/70 backdrop-blur-sm " +
    "text-gray-800 text-sm shadow-sm";

  const handleApplyRequirements = () => {
    setEducation(draftEducation as any);
    setSector(draftSector as any);
    setExperience(draftExperience as any);
    setWorkFormat(draftWorkFormat as any);
  };

  const handleReset = () => {
    resetRequirements();
    setDraftEducation("");
    setDraftSector("");
    setDraftExperience("");
    setDraftWorkFormat("");
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-5rem)] px-4">
      <div className="w-full max-w-3xl rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl p-8 md:p-10">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
            HR-вимоги до кандидата
          </h1>
          <p className="mt-2 text-sm text-gray-200/80">
            Обери базові критерії, за якими резюме буде вважатися релевантним: освіта, галузь, досвід та формат роботи.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="flex flex-col">
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-200 mb-1.5">
              Освіта
            </label>
            <p className="text-xs text-gray-300/80 mb-2">
              Мінімальний рівень формальної освіти кандидата.
            </p>
            <select
              value={draftEducation}
              onChange={(e) => setDraftEducation(e.target.value)}
              className={selectBaseClasses}
            >
              <option value="">Оберіть рівень освіти…</option>
              {educationOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-200 mb-1.5">
              Галузь роботи
            </label>
            <p className="text-xs text-gray-300/80 mb-2">
              У якій сфері шукаєш кандидата.
            </p>
            <select
              value={draftSector}
              onChange={(e) => setDraftSector(e.target.value)}
              className={selectBaseClasses}
            >
              <option value="">Оберіть галузь…</option>
              {sectorOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-200 mb-1.5">
              Досвід роботи
            </label>
            <p className="text-xs text-gray-300/80 mb-2">
              Мінімальний досвід у релевантній сфері.
            </p>
            <select
              value={draftExperience}
              onChange={(e) => setDraftExperience(e.target.value)}
              className={selectBaseClasses}
            >
              <option value="">Оберіть рівень досвіду…</option>
              {experienceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-200 mb-1.5">
              Формат роботи
            </label>
            <p className="text-xs text-gray-300/80 mb-2">
              Де та як кандидат має працювати.
            </p>
            <select
              value={draftWorkFormat}
              onChange={(e) => setDraftWorkFormat(e.target.value)}
              className={selectBaseClasses}
            >
              <option value="">Оберіть формат…</option>
              {workFormatOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleApplyRequirements}
              className="inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-medium 
                         bg-blue-500/90 hover:bg-blue-500 active:scale-[0.98] 
                         text-white shadow-lg shadow-blue-500/30 transition-transform duration-150"
            >
              Застосувати вимоги
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-xs font-medium 
                         bg-white/10 hover:bg-white/20 text-gray-100 border border-white/20 
                         transition-transform duration-150"
            >
              Скинути
            </button>
          </div>

          <div className="text-xs text-gray-200/80 md:text-right">
            <p className="mb-1 font-medium text-gray-100">Поточний фільтр:</p>
            <p className="text-[11px] md:text-xs text-gray-200/80">
              Освіта:{" "}
              <span className="font-semibold">
                {education
                  ? educationOptions.find((e) => e.value === education)?.label
                  : "не вказано"}
              </span>
              {" · "}Галузь:{" "}
              <span className="font-semibold">
                {sector
                  ? sectorOptions.find((s) => s.value === sector)?.label
                  : "не вказано"}
              </span>
              {" · "}Досвід:{" "}
              <span className="font-semibold">
                {experience
                  ? experienceOptions.find((x) => x.value === experience)?.label
                  : "не вказано"}
              </span>
              {" · "}Формат:{" "}
              <span className="font-semibold">
                {workFormat
                  ? workFormatOptions.find((w) => w.value === workFormat)?.label
                  : "не вказано"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRrequirements;