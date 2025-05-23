import { Loader2, PlusSquare } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { UserContext } from "@/context/UserContext";
import { getFirestore, doc, setDoc, collection, query, orderBy, limit, getDocs } from "firebase/firestore";

const AddResume = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [resumeTitle, setResumeTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const db = getFirestore();

  const onCreate = async () => {
    if (!user?.uid) {
      alert("User is not authenticated.");
      return;
    }

    setLoading(true);
    try {
      const resumesRef = collection(db, "usersByEmail", user.email, "resumes");
      const q = query(resumesRef, orderBy("resumeId", "desc"), limit(1));
      const querySnapshot = await getDocs(q);

      let newResumeId = 1;
      if (!querySnapshot.empty) {
        const lastResume = querySnapshot.docs[0].data();
        newResumeId = (lastResume.resumeId || 0) + 1;
      }

      const resumeDocRef = doc(resumesRef, `resume-${newResumeId}`);
      await setDoc(resumeDocRef, { resumeId: newResumeId, title: resumeTitle });

      alert("Resume created successfully!");
      setOpenDialog(false);
      navigate(`/dashboard/${user.email}/${newResumeId}/edit`);
    } catch (error) {
      console.error("Error creating resume:", error);
      alert("Failed to create resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div
        className={`p-14 py-24 border flex items-center justify-center bg-secondary rounded-lg h-[280px] hover:scale-105 transition-all hover:shadow-sm cursor-pointer border-dashed border-black ${loading && "opacity-50 cursor-not-allowed"
          }`}
        onClick={() => !loading && setOpenDialog(true)}
      >
        <PlusSquare />
      </div>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Resume</DialogTitle>
            <DialogDescription>
              <p>Add a title for your new resume</p>
              <Input
                className="my-2"
                placeholder="Ex. Full Stack Developer"
                value={resumeTitle}
                onChange={(e) => setResumeTitle(e.target.value)}
              />
            </DialogDescription>
            <div className="flex justify-end gap-5">
              <Button onClick={() => setOpenDialog(false)} variant="ghost">
                Cancel
              </Button>
              <Button disabled={!resumeTitle || loading} onClick={onCreate}>
                {loading ? <Loader2 className="animate-spin" /> : "Create"}
              </Button>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddResume;
