import { useEffect, useState } from "react";
import { useHRRequirements } from "../context/context";

type EducationValue =
  | "primary_education"
  | "basic_secondary_education"
  | "complete_secondary_education"
  | "vocational_education"
  | "junior_bachelor"
  | "bachelor"
  | "master"
  | "phd"
  | "doctor_of_science";

type SectorValue =
  | "it"
  | "finance"
  | "hr"
  | "marketing"
  | "sales"
  | "engineering"
  | "education"
  | "healthcare"
  | "other";

type ExperienceValue =
  | "no_experience"
  | "0_1"
  | "1_3"
  | "3_5"
  | "5_plus";

type WorkFormatValue = "office" | "remote" | "hybrid";

interface Candidate {
  id: number;
  firstName: string;
  lastName: string;
  education: EducationValue;
  sector: SectorValue;
  experience: ExperienceValue;
  workFormat: WorkFormatValue;
}

interface HRRequirements {
  education?: EducationValue;
  sector?: SectorValue;
  experience?: ExperienceValue;
  workFormat?: WorkFormatValue;
}

const educationOptions: { label: string; value: EducationValue }[] = [
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

const sectorOptions: { label: string; value: SectorValue }[] = [
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

const experienceOptions: { label: string; value: ExperienceValue }[] = [
  { label: "Без досвіду", value: "no_experience" },
  { label: "0–1 року", value: "0_1" },
  { label: "1–3 роки", value: "1_3" },
  { label: "3–5 років", value: "3_5" },
  { label: "5+ років", value: "5_plus" },
];

const workFormatOptions: { label: string; value: WorkFormatValue }[] = [
  { label: "Офіс", value: "office" },
  { label: "Віддалено", value: "remote" },
  { label: "Гібридний формат", value: "hybrid" },
];

const educationOrder: EducationValue[] = [
  "primary_education",
  "basic_secondary_education",
  "complete_secondary_education",
  "vocational_education",
  "junior_bachelor",
  "bachelor",
  "master",
  "phd",
  "doctor_of_science",
];

const experienceOrder: ExperienceValue[] = [
  "no_experience",
  "0_1",
  "1_3",
  "3_5",
  "5_plus",
];

const getLabel = <T extends string>(
  options: { label: string; value: T }[],
  value: T
): string => options.find((opt) => opt.value === value)?.label ?? value;

const indexOrMinusOne = <T extends string>(order: T[], v?: T) =>
  v ? order.indexOf(v) : -1;

const calcMatchScore = (candidate: Candidate, hr: HRRequirements): number => {
  let score = 0;
  let criteriaCount = 0;

  if (hr.education) {
    criteriaCount++;
    const cIdx = indexOrMinusOne(educationOrder, candidate.education);
    const rIdx = indexOrMinusOne(educationOrder, hr.education);
    if (cIdx >= rIdx) score += 1;
  }

  if (hr.sector) {
    criteriaCount++;
    if (candidate.sector === hr.sector) score += 1;
  }

  if (hr.experience) {
    criteriaCount++;
    const cIdx = indexOrMinusOne(experienceOrder, candidate.experience);
    const rIdx = indexOrMinusOne(experienceOrder, hr.experience);
    if (cIdx >= rIdx) score += 1;
  }

  if (hr.workFormat) {
    criteriaCount++;
    if (candidate.workFormat === hr.workFormat) score += 1;
  }

  if (criteriaCount === 0) return 0;

  return Math.round((score / criteriaCount) * 100);
};

const Dashboard = () => {
  const { education, sector, experience, workFormat } = useHRRequirements();

  const hrRequirements: HRRequirements = {
    education: education ? (education as EducationValue) : undefined,
    sector: sector ? (sector as SectorValue) : undefined,
    experience: experience ? (experience as ExperienceValue) : undefined,
    workFormat: workFormat ? (workFormat as WorkFormatValue) : undefined,
  };

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const res = await fetch("/cv-holder/cv-list/", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Не вдалося завантажити кандидатів");
        }

        const data = await res.json();

        const normalized: Candidate[] = (data as any[]).map((item) => ({
          id: item.id,
          firstName: item.first_name,
          lastName: item.last_name,
          education: item.education,
          sector: item.sector,
          experience: item.experience,
          workFormat: item.work_format,
        }));

        setCandidates(normalized);
      } catch (e) {
        console.error(e);
        setError("Сталася помилка при завантаженні кандидатів.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  return (
    <div className="flex items-start justify-center min-h-[calc(100vh-5rem)] px-4 py-8">
      <div className="w-full max-w-6xl space-y-8">
        <section className="rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-white tracking-tight mb-3">
            Дашборд кандидатів
          </h1>
          <p className="text-sm text-gray-200/80 mb-4">
            Тут відображаються кандидати та те, наскільки вони відповідають поточним HR-вимогам.
          </p>

          <div className="grid gap-4 md:grid-cols-4 text-xs text-gray-100">
            <div className="flex flex-col gap-1">
              <span className="uppercase text-[10px] tracking-wide text-gray-300">
                Мін. освіта
              </span>
              <span className="font-semibold">
                {hrRequirements.education
                  ? getLabel(educationOptions, hrRequirements.education)
                  : "не задано"}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="uppercase text-[10px] tracking-wide text-gray-300">
                Галузь
              </span>
              <span className="font-semibold">
                {hrRequirements.sector
                  ? getLabel(sectorOptions, hrRequirements.sector)
                  : "не задано"}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="uppercase text-[10px] tracking-wide text-gray-300">
                Мін. досвід
              </span>
              <span className="font-semibold">
                {hrRequirements.experience
                  ? getLabel(experienceOptions, hrRequirements.experience)
                  : "не задано"}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="uppercase text-[10px] tracking-wide text-gray-300">
                Формат роботи
              </span>
              <span className="font-semibold">
                {hrRequirements.workFormat
                  ? getLabel(workFormatOptions, hrRequirements.workFormat)
                  : "не задано"}
              </span>
            </div>
          </div>
        </section>

        {isLoading && (
          <p className="text-sm text-gray-200/80">Завантажуємо кандидатів…</p>
        )}

        {error && !isLoading && (
          <p className="text-sm text-red-300">{error}</p>
        )}

        {!isLoading && !error && (
          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {candidates.length === 0 && (
              <p className="text-sm text-gray-200/80">
                Поки що немає жодного збереженого резюме.
              </p>
            )}

            {candidates.map((candidate) => {
              const score = calcMatchScore(candidate, hrRequirements);

              const educationLabel = getLabel(
                educationOptions,
                candidate.education
              );
              const sectorLabel = getLabel(sectorOptions, candidate.sector);
              const experienceLabel = getLabel(
                experienceOptions,
                candidate.experience
              );
              const workFormatLabel = getLabel(
                workFormatOptions,
                candidate.workFormat
              );

              return (
                <div
                  key={candidate.id}
                  className="relative rounded-2xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-xl p-5 flex flex-col gap-4"
                >
                  <div className="absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-semibold bg-slate-900/80 text-white border border-white/20 shadow-md">
                    {score}% відповідності
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      {candidate.firstName} {candidate.lastName}
                    </h2>
                    <p className="text-xs text-gray-300 mt-0.5">
                      {sectorLabel} · {workFormatLabel}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-gray-200/80">
                      <span>Рівень відповідності вимогам</span>
                      <span className="font-semibold">{score}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-900/60 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-400 via-sky-400 to-teal-300 transition-all duration-300"
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 text-[11px]">
                    <span className="px-2 py-1 rounded-full bg-white/10 text-gray-100 border border-white/10">
                      Освіта:{" "}
                      <span className="font-semibold">{educationLabel}</span>
                    </span>
                    <span className="px-2 py-1 rounded-full bg-white/10 text-gray-100 border border-white/10">
                      Досвід:{" "}
                      <span className="font-semibold">{experienceLabel}</span>
                    </span>
                    <span className="px-2 py-1 rounded-full bg-white/10 text-gray-100 border border-white/10">
                      Галузь:{" "}
                      <span className="font-semibold">{sectorLabel}</span>
                    </span>
                    <span className="px-2 py-1 rounded-full bg-white/10 text-gray-100 border border-white/10">
                      Формат:{" "}
                      <span className="font-semibold">{workFormatLabel}</span>
                    </span>
                  </div>

                  <div className="mt-2 flex gap-2 text-xs">
                    <button className="flex-1 inline-flex items-center justify-center rounded-xl px-3 py-2 bg-blue-500/90 hover:bg-blue-500 text-white font-medium shadow-md shadow-blue-500/30 transition-colors">
                      Переглянути детально
                    </button>
                    <button className="flex-1 inline-flex items-center justify-center rounded-xl px-3 py-2 bg-white/10 hover:bg-white/20 text-gray-100 border border-white/20 font-medium transition-colors">
                      Позначити як цікавого
                    </button>
                  </div>
                </div>
              );
            })}
          </section>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
