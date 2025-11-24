import React, { useState } from "react";
import { getCookie } from "../utils/csrf";

const CV = () => {
  const [mode, setMode] = useState<"pdf" | "manual">("pdf");
  const [file, setFile] = useState<File | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [education, setEducation] = useState("");
  const [sector, setSector] = useState("");
  const [experience, setExperience] = useState("");
  const [workFormat, setWorkFormat] = useState("");

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

  const inputBaseClasses =
    "w-full py-2.5 px-3 border border-gray-200/70 rounded-xl " +
    "focus:ring-2 focus:ring-blue-400 focus:border-blue-400 " +
    "transition-all duration-200 bg-white/70 backdrop-blur-sm " +
    "text-gray-800 text-sm shadow-sm";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (selected.type !== "application/pdf") {
      alert("Будь ласка, завантаж PDF-файл.");
      return;
    }

    const maxSizeMb = 5;
    if (selected.size > maxSizeMb * 1024 * 1024) {
      alert(`Файл завеликий. Максимальний розмір: ${maxSizeMb} МБ.`);
      return;
    }

    setFile(selected);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const handleSubmit = async () => {
    setSubmitError(null);
    setSubmitSuccess(null);

    if (mode === "pdf") {
      if (!file) {
        alert("Будь ласка, завантаж резюме у форматі PDF.");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      try {
        setIsSubmitting(true);

        const res = await fetch("/cv-holder/cv-pdf-upload/", {
          method: "POST",
          body: formData,
          credentials: "include",
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => null);
          console.error("Помилка бекенду:", errData || res.statusText);
          throw new Error("Не вдалося завантажити PDF");
        }

        const data = await res.json();
        console.log("Кандидат створений з PDF:", data);
        setSubmitSuccess("Резюме з PDF успішно оброблено ✅");
      } catch (e) {
        console.error(e);
        setSubmitError("Сталася помилка при завантаженні PDF.");
      } finally {
        setIsSubmitting(false);
      }

      return;
    }

    if (
      !firstName &&
      !lastName &&
      !education &&
      !sector &&
      !experience &&
      !workFormat
    ) {
      alert("Заповни хоча б одне поле, щоб зберегти анкету.");
      return;
    }

    const payload = {
      firstName,
      lastName,
      education,
      sector,
      experience,
      workFormat,
    };

    try {
      setIsSubmitting(true);

      const csrftoken = getCookie("csrftoken");

      const res = await fetch("/cv-holder/cv-form-upload/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(csrftoken ? { "X-CSRFToken": csrftoken } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        console.error("Помилка бекенду:", errorData || res.statusText);
        throw new Error("Не вдалося зберегти кандидата");
      }

      const data = await res.json();
      console.log("Кандидат збережений:", data);

      setSubmitSuccess("Резюме кандидата успішно збережено ✅");

      setFirstName("");
      setLastName("");
      setEducation("");
      setSector("");
      setExperience("");
      setWorkFormat("");
    } catch (err) {
      console.error(err);
      setSubmitError("Сталася помилка при збереженні. Спробуй ще раз.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-5rem)] px-4">
      <div className="w-full max-w-3xl rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl p-8 md:p-10">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
            Резюме кандидата
          </h1>
          <p className="mt-2 text-sm text-gray-200/80">
            Ти можеш завантажити резюме у форматі PDF або швидко заповнити коротку анкету
            за тими ж параметрами, що й HR-фільтр.
          </p>
        </div>

        <div className="mb-6 inline-flex rounded-xl border border-white/10 bg-white/10 p-1">
          <button
            type="button"
            onClick={() => setMode("pdf")}
            className={
              "px-4 py-2 text-xs md:text-sm font-medium rounded-lg transition-all " +
              (mode === "pdf"
                ? "bg-blue-500 text-white shadow-md shadow-blue-500/40"
                : "text-gray-200 hover:bg-white/10")
            }
          >
            Завантажити PDF
          </button>
          <button
            type="button"
            onClick={() => setMode("manual")}
            className={
              "px-4 py-2 text-xs md:text-sm font-medium rounded-lg transition-all " +
              (mode === "manual"
                ? "bg-blue-500 text-white shadow-md shadow-blue-500/40"
                : "text-gray-200 hover:bg-white/10")
            }
          >
            Заповнити анкету
          </button>
        </div>

        {mode === "pdf" && (
          <div className="space-y-5">
            <div className="flex flex-col">
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-200 mb-1.5">
                Файл резюме (PDF)
              </label>
              <p className="text-xs text-gray-300/80 mb-3">
                Завантаж актуальне резюме у форматі PDF — далі система й HR зможуть працювати з ним.
              </p>

              <label
                htmlFor="cvFile"
                className="flex flex-col items-center justify-center gap-2 border border-dashed border-gray-300/70 rounded-2xl 
                           bg-white/60 hover:bg-white/80 transition-all cursor-pointer px-4 py-8 text-center"
              >
                <span className="text-sm font-medium text-gray-800">
                  Клікни, щоб обрати файл, або перетягни його сюди
                </span>
                <span className="text-[11px] text-gray-500">
                  Підтримується тільки формат PDF, до 5 МБ
                </span>
                {file && (
                  <span className="mt-2 text-xs text-gray-700">
                    Обрано файл:{" "}
                    <span className="font-semibold">{file.name}</span>
                  </span>
                )}
              </label>

              <input
                id="cvFile"
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>
        )}

        {mode === "manual" && (
          <div className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2 flex flex-col gap-4 md:flex-row">
              <div className="flex-1 flex flex-col">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-200 mb-1.5">
                  Імʼя
                </label>
                <p className="text-xs text-gray-300/80 mb-2">
                  Як до кандидата можна звертатись.
                </p>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={inputBaseClasses}
                  placeholder="Наприклад, Андрій"
                />
              </div>

              <div className="flex-1 flex flex-col">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-200 mb-1.5">
                  Прізвище
                </label>
                <p className="text-xs text-gray-300/80 mb-2">
                  Прізвище кандидата.
                </p>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={inputBaseClasses}
                  placeholder="Наприклад, Спесівцев"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-200 mb-1.5">
                Освіта
              </label>
              <p className="text-xs text-gray-300/80 mb-2">
                Фактичний рівень освіти кандидата.
              </p>
              <select
                value={education}
                onChange={(e) => setEducation(e.target.value)}
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
                Поточна або цільова сфера діяльності кандидата.
              </p>
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value)}
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
                Скільки років релевантного досвіду має кандидат.
              </p>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
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
                У якому форматі кандидат готовий працювати.
              </p>
              <select
                value={workFormat}
                onChange={(e) => setWorkFormat(e.target.value)}
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
        )}

        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-medium 
                       ${isSubmitting ? "bg-blue-400 cursor-wait" : "bg-blue-500/90 hover:bg-blue-500 active:scale-[0.98]"} 
                       text-white shadow-lg shadow-blue-500/30 transition-transform duration-150`}
          >
            {isSubmitting ? "Зберігаємо..." : "Зберегти резюме"}
          </button>

          <div className="text-xs text-gray-200/80 md:text-right space-y-1">
            <p className="mb-1 font-medium text-gray-100">
              Режим:{" "}
              <span className="font-semibold">
                {mode === "pdf" ? "завантаження PDF" : "анкетні дані"}
              </span>
            </p>

            {submitSuccess && (
              <p className="text-[11px] text-emerald-300">{submitSuccess}</p>
            )}
            {submitError && (
              <p className="text-[11px] text-red-300">{submitError}</p>
            )}
            {mode === "manual" && (
              <p className="text-[11px] md:text-xs text-gray-200/80">
                Кандидат:{" "}
                <span className="font-semibold">
                  {firstName || lastName
                    ? `${firstName} ${lastName}`.trim()
                    : "не вказано"}
                </span>
                {" · "}Освіта:{" "}
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
            )}
            {mode === "pdf" && (
              <p className="text-[11px] md:text-xs text-gray-200/80">
                {file ? `Обраний файл: ${file.name}` : "Файл ще не обрано."}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CV;
