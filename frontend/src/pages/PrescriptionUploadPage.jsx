import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSkeleton from "../components/LoadingSkeleton";
import Card from "../components/Card";
import UploadBox from "../components/UploadBox";
import { useAppContext } from "../utils/AppContext";

export default function PrescriptionUploadPage() {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const { processUpload, uploadState } = useAppContext();
  const navigate = useNavigate();

  const handleProcess = async ({ file, image }) => {
    setProcessing(true);
    setError("");
    try {
      await processUpload({ file, image });
      // Removed automatic navigate to keep the user on this page to see the results
    } catch (err) {
      setError(err.message || "Failed to process prescription");
    } finally {
      setProcessing(false);
    }
  };

  const aiResult = uploadState?.interactions;

  return (
    <div className="space-y-6">
      <UploadBox onProcess={handleProcess} processing={processing} />

      {error && (
        <div className="rounded-lg bg-red-100 p-4 text-red-700">
          <strong>Error: </strong> {error}
        </div>
      )}

      <div className="grid gap-6">
        <Card className="p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Processing preview</p>
          <div className="mt-5 space-y-3">
            {processing ? (
              <>
                <LoadingSkeleton className="h-24" />
                <LoadingSkeleton className="h-24" />
                <LoadingSkeleton className="h-24" />
              </>
            ) : aiResult && aiResult.isSafe !== undefined ? (
              <div className={`rounded-[1.5rem] p-5 text-sm shadow-sm ${aiResult.isSafe ? 'bg-green-50 text-green-900 border border-green-200' : 'bg-rose-50 text-rose-900 border border-rose-200'}`}>
                <div className="flex items-center gap-3 border-b pb-3 mb-3" style={{ borderColor: aiResult.isSafe ? '#bbf7d0' : '#fecdd3' }}>
                   <div className={`flex h-10 w-10 items-center justify-center rounded-full ${aiResult.isSafe ? 'bg-green-200' : 'bg-rose-200'} text-xl`}>
                     {aiResult.isSafe ? "✅" : "⚠️"}
                   </div>
                   <h3 className="text-xl font-bold">{aiResult.isSafe ? "Prescription is Safe" : "Unsafe Combinations Detected"}</h3>
                </div>
                
                <p className="text-base font-medium mb-4">{aiResult.explanation}</p>
                
                {!aiResult.isSafe && aiResult.issues && aiResult.issues.length > 0 && (
                  <div className="mt-4 space-y-3">
                    <p className="font-bold text-rose-800 uppercase tracking-wider text-xs">Identified Risks:</p>
                    {aiResult.issues.map((issue, idx) => (
                      <div key={idx} className="bg-white/60 p-3 rounded-xl border border-rose-100">
                        <div className="flex justify-between items-center mb-1">
                           <span className="font-bold text-rose-900">{issue.problem}</span>
                           <span className={`text-xs font-bold px-2 py-1 rounded-full ${issue.severity === 'high' ? 'bg-rose-500 text-white' : 'bg-orange-200 text-orange-900'}`}>
                             {issue.severity.toUpperCase()}
                           </span>
                        </div>
                        <p className="text-sm text-rose-800/80">{issue.reason}</p>
                      </div>
                    ))}
                  </div>
                )}

                {aiResult.suggestions && aiResult.suggestions.length > 0 && (
                  <div className={`mt-5 p-4 rounded-xl bg-white/50 border ${aiResult.isSafe ? 'border-green-100' : 'border-rose-100'}`}>
                    <p className="font-bold uppercase tracking-wider text-xs mb-2">Suggestions:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      {aiResult.suggestions.map((sug, i) => (
                        <li key={i}>{sug}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
               <div className="flex flex-col items-center justify-center h-48 text-center text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200 dark:bg-white/5 dark:border-white/10">
                 <p>Upload a prescription to run the AI safety analysis.</p>
               </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
