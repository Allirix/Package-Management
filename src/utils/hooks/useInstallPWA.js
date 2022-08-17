import { useEffect, useState } from "react";

const InstallPWA = () => {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] = useState(null);

  useEffect(() => {
    const promptHandler = (e) => {
      e.preventDefault();
      alert("Install PWA Prompt");
      setSupportsPWA(true);
      setPromptInstall(e);
    };
    relatedApplicationLog();
    window.addEventListener("beforeinstallprompt", promptHandler);
    return () =>
      window.removeEventListener("beforeinstallprompt", promptHandler);
  }, []);

  return { supportsPWA, promptInstall };
};

export default InstallPWA;

const relatedApplicationLog = async () => {
  console.log(
    "PWA related Applications" +
      JSON.stringify(await navigator.getInstalledRelatedApps())
  );
};
