import { useEffect, useRef } from "react";
// import { motion } from "framer-motion";
import * as NGL from "ngl";

interface ProteinViewerProps {
  pdbData: string;
}

const ProteinViewer = ({ pdbData }: ProteinViewerProps) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<any>(null);

  useEffect(() => {
    if (!viewerRef.current || !pdbData) return;
    // console.log(pdbData);
    // Initialize NGL Stage if it doesn't exist
    if (!stageRef.current) {
      stageRef.current = new NGL.Stage(viewerRef.current);

      stageRef.current.removeAllComponents();
      stageRef.current.loadFile(new Blob([pdbData], { type: "text/plain" }), {
        ext: "pdb",
        defaultRepresentation: true,
      });
    }
  }, [pdbData]);

  return (
    <div
      ref={viewerRef}
      style={{ width: "400px", height: "400px", border: "1px solid #ccc" }}
    />
  );
};

export default ProteinViewer;
