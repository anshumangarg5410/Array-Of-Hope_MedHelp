import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSkeleton from "../components/LoadingSkeleton";
import Card from "../components/Card";
import UploadBox from "../components/UploadBox";
import { useAppContext } from "../utils/AppContext";

export default function PrescriptionUploadPage() {
  const [processing, setProcessing] = useState(false);
  const { processUpload, uploadState } = useAppContext();
  const navigate = useNavigate();

  const handleProcess = async ({ file, image }) => {
    setProcessing(true);
    await processUpload({ file, image });
    setProcessing(false);
    navigate("/patient/results");
  };

  return (
    <div className="space-y-6">
      <UploadBox onProcess={handleProcess} processing={processing} />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Upload flow</p>
          <div className="mt-5 space-y-4">
            {["Upload image", "Run mock OCR", "Extract medicines", "Validate combinations", "Generate alerts"].map(
              (step, index) => (
                <div key={step} className="flex items-center gap-4 rounded-[1.5rem] bg-white/70 p-4 dark:bg-white/5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white dark:bg-white dark:text-slate-950">
                    0{index + 1}
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-200">{step}</p>
                </div>
              ),
            )}
          </div>
        </Card>

        <Card className="p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Processing preview</p>
          <div className="mt-5 space-y-3">
            {processing ? (
              <>
                <LoadingSkeleton className="h-24" />
                <LoadingSkeleton className="h-24" />
                <LoadingSkeleton className="h-24" />
              </>
            ) : (
              uploadState.extracted.map((medicine) => (
                <div
                  key={medicine.name}
                  className="rounded-[1.5rem] bg-white/70 p-4 text-sm text-slate-700 dark:bg-white/5 dark:text-slate-200"
                >
                  <p className="font-semibold">{medicine.name}</p>
                  <p className="mt-2 text-slate-500 dark:text-slate-400">{medicine.dose} • {medicine.schedule}</p>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
