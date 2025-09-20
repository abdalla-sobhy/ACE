export const egyptianAcademicDomains = [
  // Public Universities
  'cu.edu.eg', // Cairo University
  'alexu.edu.eg', // Alexandria University
  'aun.edu.eg', // Assiut University
  'mans.edu.eg', // Mansoura University
  'zu.edu.eg', // Zagazig University
  'tanta.edu.eg', // Tanta University
  'helwan.edu.eg', // Helwan University
  'bsu.edu.eg', // Beni-Suef University
  'fayoum.edu.eg', // Fayoum University
  'bu.edu.eg', // Benha University
  'menofia.edu.eg', // Menoufia University
  'suez.edu.eg', // Suez University
  'svu.edu.eg', // South Valley University
  'aswu.edu.eg', // Aswan University
  'du.edu.eg', // Damietta University
  'psu.edu.eg', // Port Said University
  'bfsu.edu.eg', // Beni Suef University
  'kasralainy.edu.eg', // Kasr Al-Ainy
  'azhar.edu.eg', // Al-Azhar University
  'asu.edu.eg', // Ain Shams University
  'suezcanal.edu.eg', // Suez Canal University
  'minia.edu.eg', // Minia University
  'kafr-elsheikh.edu.eg', // Kafr El-Sheikh University
  'sohag.edu.eg', // Sohag University
  'dmu.edu.eg', // Damanhour University
  
  // Private Universities
  'aucegypt.edu', // American University in Cairo
  'guc.edu.eg', // German University in Cairo
  'bue.edu.eg', // British University in Egypt
  'fue.edu.eg', // Future University in Egypt
  'msa.edu.eg', // October University for Modern Sciences and Arts
  'o6u.edu.eg', // 6th of October University
  'miu.edu.eg', // Misr International University
  'must.edu.eg', // Misr University for Science and Technology
  'nu.edu.eg', // Nile University
  'aast.edu', // Arab Academy for Science and Technology
  'pua.edu.eg', // Pharos University in Alexandria
  'eur.edu.eg', // Egyptian Russian University
  'eui.edu.eg', // Egyptian University of Informatics
  'cu.edu.eg', // Canadian University
  'hcu.edu.eg', // Horus University
  'bau.edu.eg', // Badr University
  'su.edu.eg', // Sinai University
  'ngu.edu.eg', // New Giza University
  'ufe.edu.eg', // Université Française d'Égypte
  'hu.edu.eg', // Heliopolis University
  'du.edu.eg', // Delta University
  'mu.edu.eg', // Merit University
  
  // Technical Colleges and Institutes
  'hti.edu.eg', // Higher Technological Institute
  'aiet.edu.eg', // Alexandria Institute of Engineering and Technology
  'bhit.bu.edu.eg', // Benha Higher Institute of Technology
  
  // Research Centers and Academies
  'nrc.sci.eg', // National Research Centre
  'sti.sci.eg', // Science and Technology Institute
];

export const normalizeDomain = (email: string): string => {
  const domain = email.toLowerCase().split('@')[1];
  return domain?.replace(/^www\./, '') || '';
};

export const isEgyptianAcademicDomain = (email: string): boolean => {
  const domain = normalizeDomain(email);
  return egyptianAcademicDomains.some(academicDomain => 
    domain === academicDomain || domain.endsWith(`.${academicDomain}`)
  );
};