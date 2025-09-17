import { LOGO_PATH } from "@/config";

export default function ProductionCompanies({ companies = [] }) {
  if (!companies?.length) {
    return null;
  }
  return (
    <section className="mt-6">
      <div className="flex flex-wrap items-center gap-4">
        {companies
          .filter((c) => Boolean(c.logo_path))
          .map((c) => (
            <div className="rounded bg-white p-2" key={c.id}>
              <div
                className="h-8 w-28 bg-center bg-contain bg-no-repeat"
                role="img"
                style={{ backgroundImage: `url(${LOGO_PATH}${c.logo_path})` }}
                title={c.name}
              />
            </div>
          ))}
      </div>
    </section>
  );
}
