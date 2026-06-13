import Logo from "./Logo";

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950 px-4 py-10">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />

          <p className="mt-4 max-w-md text-sm leading-6 text-slate-400">
            HireGenie AI helps students improve resumes, prepare for interviews,
            practice coding, track aptitude, generate career roadmaps, and become
            job-ready.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-white">Platform</h4>
          <div className="mt-4 space-y-3 text-sm text-slate-400">
            <p>Resume Analyzer</p>
            <p>Mock Interview</p>
            <p>Coding Arena</p>
            <p>Career Roadmap</p>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-white">Student Tools</h4>
          <div className="mt-4 space-y-3 text-sm text-slate-400">
            <p>ATS Reports</p>
            <p>Aptitude Tests</p>
            <p>Certificates</p>
            <p>Job Tracker</p>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 pt-6 text-sm text-slate-500">
        © {new Date().getFullYear()} HireGenie AI. Built as a premium Python Full Stack project.
      </div>
    </footer>
  );
}

export default Footer;