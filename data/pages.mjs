import { SOURCES } from './site.mjs';

export const HOME = {
  route: '',
  kind: 'home',
  title: 'AI, Cybersecurity & Blockchain',
  description: 'Develop the expertise to pursue high-demand technology careers through a Swiss-based education.',
  future: 'You develop in-demand expertise through programs designed in close alignment with industry expectations. You benefit from a Swiss academic environment known for its excellence and innovation, while learning directly from professionals who bring real-world experience into the classroom.',
  facts: [
    { title: '6', text: 'Bachelor and Master programs' },
    { title: '3', text: 'Intakes: January · April · September' },
    { title: '180 ECTS', text: 'Bachelor programs · 3 years' },
    { title: '120 ECTS', text: 'Master programs · 2 years' },
  ],
  source: SOURCES.home,
};

export const PROGRAMS_PAGE = {
  route: 'programs',
  kind: 'programs',
  title: 'Programs',
  description: 'Explore dual Swiss and US Bachelor and Master programs in artificial intelligence, cybersecurity, and blockchain.',
  source: SOURCES.programs,
};

export const BACHELOR_AI = {
  route: 'programs/bachelor-in-artificial-intelligence',
  kind: 'program',
  discipline: 'Artificial Intelligence',
  level: 'Bachelor',
  title: 'Bachelor of Science in Artificial Intelligence',
  description: 'The Bachelor of Science in Artificial Intelligence at the Helvetic Institute of Technology is designed for students who want to go beyond simply using technology and learn how to build it.',
  source: SOURCES.bachelorAi,
  descriptionMore: 'The program provides a strong foundation in key areas such as machine learning, neural networks, and data-driven systems, while also introducing emerging topics like generative AI and large language models.',
  overview: 'The Bachelor of Science in Artificial Intelligence at Helvetic Tech provides a strong foundation in artificial intelligence, combining technical knowledge with practical application. The program is designed to prepare students to understand, develop, and apply AI technologies in real-world environments.',
  overviewMore: 'Through a hands-on, project-based approach, students explore key areas such as machine learning, neural networks, and generative AI. The curriculum emphasizes problem-solving, innovation, and collaboration, enabling students to work on real use cases and interact with industry-relevant tools and methodologies.',
  facts: [
    { title: 'Location', text: 'La Tour-de-Peilz, Lake Geneva, Switzerland, on campus + online' },
    { title: 'Duration', text: '3 years' },
    { title: 'Language', text: 'English' },
    { title: 'Study mode', text: 'Blended (on campus + online)' },
    { title: 'Credits', text: '135 CH | 180 ECTS' },
    { title: 'Structure', text: '9 Academic Terms' },
  ],
  outcomes: [
    'A solid understanding of artificial intelligence concepts and technologies',
    'The ability to apply AI methods to practical, real-world problems',
    'Experience with key areas such as machine learning, neural networks, and generative AI',
    'Problem-solving and analytical skills in technology-driven environments',
    'Practical experience through hands-on projects and applied learning',
  ],
  curriculum: [
    { title: 'Foundations of computing and data', text: 'Programming and data science fundamentals · Data handling and analysis · Mathematical and logical foundations' },
    { title: 'Core artificial intelligence topics', text: 'Machine learning · Neural networks · Computer vision · Reinforcement learning · Ethical AI' },
    { title: 'Advanced AI and emerging technologies', text: 'Generative AI and advanced models · AI system deployment · AI applications in business and industry' },
    { title: 'Applied learning and practical experience', text: 'Practical workshops and labs · Hands-on projects · Real-world AI use cases' },
    { title: 'Capstone project', text: 'Research thesis or applied AI project · Focus on solving a real-world problem · Demonstration of technical and analytical skills' },
  ],
  careers: [
    'Artificial Intelligence (AI) Specialist',
    'Machine Learning Engineer',
    'Data Analyst or Data Scientist',
    'AI Solutions Consultant',
    'Business Intelligence Analyst',
    'AI Product or Project Coordinator',
  ],
};

// Time-sensitive figures (tuition, fees, exact intake dates) and unconfirmed
// rosters are deliberately omitted per the content source register.
export const ADMISSIONS = {
  route: 'admissions',
  kind: 'admissions',
  title: 'Admissions',
  description: 'The admissions process at Helvetic Tech is designed to be clear, structured, and accessible, while ensuring that applicants have the academic foundation and motivation required to succeed in a technology-focused environment.',
  source: SOURCES.admissions,
  intro: 'The admissions process at Helvetic Tech is designed to be clear, structured, and accessible, while ensuring that applicants have the academic foundation and motivation required to succeed in a technology-focused environment.',
  body: 'Applications are open to candidates of all nationalities. The admissions team provides guidance throughout each stage, from initial application to final enrolment. With a rolling admissions process, candidates can apply at any time and receive timely feedback.',
  facts: [
    { title: 'All nationalities', text: 'Applications are open to candidates of all nationalities.' },
    { title: 'Rolling admissions', text: 'With a rolling admissions process, candidates can apply at any time and receive timely feedback.' },
    { title: 'Three intakes per year', text: 'January · April · September' },
  ],
  steps: [
    {
      title: 'Submit your application',
      text: 'Complete the application form and upload the required documents.',
    },
    {
      title: 'Review and interview',
      text: 'Your application is reviewed by the admissions team. You may be invited to an online interview.',
    },
    {
      title: 'Admission decision',
      text: 'You will receive a decision and, if successful, an offer with the next steps to confirm your place.',
    },
    {
      title: 'Visa and arrival',
      text: 'Students requiring a visa complete the process through their local Swiss embassy or consulate. Helvetic Tech provides guidance and supporting documentation.',
    },
  ],
  documents: [
    'Completed application form',
    'Valid passport',
    'Academic transcripts and diplomas',
    'Curriculum vitae (CV)',
    'Motivation letter',
    'Proof of English proficiency (if required)',
    'Financial documentation (for visa purposes)',
  ],
  documentsNote: 'Documents not in English may require certified translation.',
  eligibility: [
    {
      title: 'Bachelor programs',
      text: 'Applicants must hold a recognized secondary school diploma or equivalent qualification.',
    },
    {
      title: 'Master programs',
      text: 'Applicants must hold a recognized bachelor’s degree or equivalent qualification.',
    },
    {
      title: 'English proficiency',
      text: 'Applicants whose previous education was not conducted in English may be required to demonstrate sufficient proficiency.',
    },
  ],
  notes: [
    {
      title: 'Offer and enrolment',
      text: 'To confirm your enrolment, you sign and return the offer letter and student agreement, pay the admission fee, and receive official acceptance documents required for visa applications and administrative procedures.',
    },
    {
      title: 'Visa and arrival',
      text: 'Students requiring a visa complete the application process through their local Swiss embassy or consulate. Helvetic Tech provides guidance and supporting documentation throughout, and applicants are encouraged to apply early.',
    },
    {
      title: 'Credit transfer',
      text: 'Applicants may request recognition of prior learning or credit transfer. Each request is evaluated individually based on course content and academic standards.',
    },
    {
      title: 'Accommodation',
      text: 'Helvetic Tech supports students in finding accommodation in the Lake Geneva region. A limited number of options are reserved for students and allocated on a first-come, first-served basis, so early application is recommended.',
    },
  ],
};

export const INSTITUTE = {
  route: 'institute',
  kind: 'institute',
  title: 'Institute',
  description: 'Shaping the next generation of professionals in a rapidly evolving technological landscape.',
  source: SOURCES.about,
  intro: 'Helvetic Institute of Technology focuses on preparing students for the realities of today’s digital world. The programs are designed to combine strong academic foundations with practical, hands-on learning that reflects how technology is used in real environments.',
  body: 'Students develop expertise in areas such as artificial intelligence, cybersecurity, and emerging technologies, while also building the ability to think critically, solve problems, and adapt to change. With smaller class sizes and close interaction with instructors, the learning experience is more focused, interactive, and directly connected to industry expectations.',
  mission: 'Helvetic Tech aspires to become Europe’s premier boutique private college for emerging technology education and innovation. By connecting academia with industry, Helvetic Tech encompasses a global community of leading academics, industry experts, digital pioneers and entrepreneurs.',
  vision: 'It is Helvetic Tech’s vision to actively shape the development and usage of emerging technologies and to ensure all stakeholders are equipped to navigate and influence a rapidly evolving society.',
  values: [
    {
      title: 'Innovation',
      text: 'Driven by curiosity and experimentation, learning goes beyond theory to explore emerging technologies and new ideas.',
    },
    {
      title: 'Relevance',
      text: 'Programs are designed around real-world applications, ensuring skills remain practical, current, and directly applicable.',
    },
    {
      title: 'Global perspective',
      text: 'A combination of Swiss academic rigor and international exposure prepares students for opportunities across global markets.',
    },
    {
      title: 'Mentorship',
      text: 'A personalized learning environment with small class sizes enables close guidance and meaningful academic support.',
    },
  ],
  community: [
    {
      title: 'Alumni',
      text: 'Graduates of Helvetic Tech become part of an active alumni community, connected through shared academic experience and professional ambition. As they progress in their careers, alumni remain part of a growing network that reflects the global and innovative environment of the institution.',
    },
    {
      title: 'Professional Network',
      text: 'Students become part of an international community that extends beyond the classroom. Through connections with peers, faculty, and industry professionals, they build a strong network that supports career growth and creates lasting professional and personal relationships.',
    },
  ],
};

// Only stable, displayed contact details are used. Email addresses, opening
// hours, and department recipients still require institutional confirmation.
export const CONTACT = {
  route: 'contact',
  kind: 'contact',
  title: 'Contact',
  description: 'Developing future leaders on the shores of Lake Geneva. A hub of academic excellence bridging American education with Swiss precision.',
  source: SOURCES.home,
  details: [
    { term: 'Address', value: 'Chemin du Levant 5, 1814 La Tour-de-Peilz, Switzerland' },
    { term: 'Phone', value: '+41 21 944 95 01' },
  ],
};

export const INSIGHTS = {
  route: 'career-impact',
  kind: 'insights',
  title: 'Career outcomes',
  description: 'The value of a Helvetic Tech education is best understood through the opportunities it creates over time.',
  source: SOURCES.careerOutcomes,
  chapters: [
    {
      number: '01',
      label: 'The Helvetic Tech career advantage',
      title: 'The Helvetic Tech career advantage',
      text: 'The career advantage at Helvetic Tech is built on a combination of academic structure, environment, and exposure. Students benefit from a dual-degree model, a personalized learning experience with close faculty interaction, a location within a dynamic economic region, and an international student community.',
    },
    {
      number: '02',
      label: 'Dual-degree career value',
      title: 'Dual-degree career value',
      text: 'One of the defining features of the Helvetic Tech experience is its dual-degree structure. Students graduate with a Swiss qualification alongside a degree from Tiffin University, combining two complementary academic systems.',
    },
    {
      number: '03',
      label: 'Career pathways',
      title: 'Career pathways',
      text: 'Graduates of Helvetic Tech pursue opportunities across a variety of sectors, including technology, consulting, finance, and digital industries. Rather than focusing on a single predefined path, the programs emphasize versatility.',
    },
    {
      number: '04',
      label: 'Skills for the modern workplace',
      title: 'Skills for the modern workplace',
      text: 'Throughout their studies, students develop a combination of technical and transferable skills that are essential in today’s job market. These include analytical thinking and problem-solving, digital and technological competencies, communication and teamwork, and cross-cultural awareness.',
    },
    {
      number: '05',
      label: 'Your career starts here',
      title: 'Your career starts here',
      text: 'Career development at Helvetic Tech begins from the first day of the program. Through a combination of academic learning, practical exposure, and an international perspective, students build a foundation that supports long-term growth.',
    },
  ],
};

export const CAMPUS_LIFE = {
  route: 'campus-life',
  kind: 'campus',
  title: 'Campus Life',
  description: 'Campus life at Helvetic Tech is shaped by a combination of focused academic study, an international environment, and a unique location on the shores of Lake Geneva.',
  source: SOURCES.campusLife,
  intro: 'Campus life at Helvetic Tech is shaped by a combination of focused academic study, an international environment, and a unique location on the shores of Lake Geneva.',
  body: 'The experience extends beyond the classroom, offering students the opportunity to study in a setting that supports both personal development and exposure to a global environment.',
  riviera: {
    title: 'Life on the Swiss Riviera',
    text: 'Helvetic Tech is located in La Tour-de-Peilz, within the Swiss Riviera — a region known for its natural landscape, international atmosphere, and quality of life. The area offers a balance between a calm, safe environment and access to nearby cities such as Lausanne and Geneva.',
  },
  campus: {
    title: 'Campus environment',
    text: 'The campus is designed to support a structured and interactive learning experience. Students benefit from modern classrooms, collaborative spaces, and an environment that encourages direct interaction with faculty and peers.',
  },
  activities: [
    'Outdoor sports and lake activities',
    'Hiking and mountain excursions',
    'Cultural visits and local events',
    'Informal student gatherings',
  ],
  cultural: {
    title: 'Cultural environment',
    text: 'The Lake Geneva region offers a diverse cultural setting, with access to museums, historical sites, and international events. Students are exposed to different cultures and perspectives, both within the classroom and in daily life.',
  },
  studentLife: {
    title: 'Student life',
    text: 'Throughout the academic year, students have opportunities to engage in activities that support community building and interaction. This may include orientation activities, social events, and informal gatherings that help students connect and integrate into the environment.',
  },
  switzerland: {
    title: 'Exploring Switzerland',
    text: 'Studying in Switzerland provides access to a country known for its natural environment, safety, and efficient infrastructure. Students can travel easily within the country and to neighbouring European cities.',
  },
  town: {
    title: 'Living in La Tour-de-Peilz',
    text: 'La Tour-de-Peilz offers a calm and accessible living environment on the shores of Lake Geneva. The town provides essential services, local shops, and easy access to public transport.',
  },
  quote: 'Studying at Helvetic Tech combines academic focus with an environment that supports personal growth.',
};

// The roster, biographies, portraits and statistics on the source faculty page
// still require confirmation (see the content source register). Only the
// publicly published names and titles are carried over here.
const FACULTY = {
  route: 'faculty',
  kind: 'faculty',
  title: 'Faculty',
  description: 'Learn from instructors who are active professionals in their fields.',
  source: SOURCES.faculty,
  intro: 'Learn from instructors who are active professionals in their fields. Our faculty bring current industry experience into the classroom, ensuring that teaching is grounded in real-world practice and aligned with today’s professional environments.',
  people: [
    { name: 'Noura El Moussa', role: 'Faculty' },
    { name: 'Dr. Tabot Arreytambe', role: 'Faculty' },
    { name: 'Robert Fontaine', role: 'Faculty' },
  ],
};

export const POLICIES = {
  route: 'policies',
  kind: 'policies',
  title: 'Policies',
  description: 'Helvetic Institute of Technology complies with applicable global laws and regulations.',
  source: SOURCES.policies,
  complianceUrl: 'https://www.helvetictech.ch/privacy',
};

export const FAQ = {
  route: 'faq',
  kind: 'faq',
  title: 'Questions and answers',
  description: 'Answers about programs, admissions, visas, accommodation, and student life at Helvetic Tech.',
  source: SOURCES.faq,
  groups: [
    {
      id: 'about',
      title: 'About Helvetic Tech',
      items: [
        { q: 'Where is Helvetic Tech located?', a: 'Helvetic Tech is located in La Tour-de-Peilz, in the Lake Geneva region of Switzerland. The campus is situated in the Swiss Riviera, with convenient access to cities such as Lausanne and Geneva, as well as major European destinations.' },
        { q: 'What makes Helvetic Tech different?', a: 'Helvetic Tech combines Swiss academic standards with a practical, industry-focused approach. Programs are designed to integrate technical knowledge with real-world applications, supported by small class sizes and a personalized learning environment.' },
        { q: 'What programs does Helvetic Tech offer?', a: 'Helvetic Tech offers bachelor’s and master’s programs in fields such as artificial intelligence, cybersecurity, and blockchain, with a strong focus on emerging technologies.' },
        { q: 'What are dual degrees?', a: 'Dual degrees are programs delivered in partnership between Helvetic Tech and Tiffin University. Upon successful completion, students receive both a Swiss qualification from Helvetic Tech and an American degree from Tiffin University.' },
      ],
    },
    {
      id: 'admissions',
      title: 'Admissions and applications',
      items: [
        { q: 'How do I apply to Helvetic Tech?', a: 'Applications are submitted online through the application form. You can start your application and submit any missing documents once they become available, allowing you to secure your place while completing your file.' },
        { q: 'What are the admission requirements?', a: 'Admission requirements depend on the level of study. For bachelor’s programs, applicants must hold a recognized secondary school diploma. For master’s programs, applicants must hold a relevant undergraduate degree or equivalent. Applicants may also need to demonstrate English proficiency if previous studies were not conducted in English.' },
        { q: 'What documents are required for admission?', a: 'Applicants are typically required to submit a completed application form, academic transcripts and diplomas, identification such as a passport or equivalent, and proof of English proficiency if applicable. Additional documents may be requested depending on the program.' },
        { q: 'Can I defer my admission?', a: 'Deferral options may be available depending on the intake and individual circumstances. Applicants should contact the admissions team for specific guidance.' },
      ],
    },
    {
      id: 'visa',
      title: 'Student visa and insurance',
      items: [
        { q: 'Do I need a student visa to study in Switzerland?', a: 'Students from outside the EU/EEA generally require a student visa. The process is handled through the Swiss embassy or consulate in the applicant’s country.' },
        { q: 'How does Helvetic Tech support the visa process?', a: 'Helvetic Tech provides the necessary documentation and guidance to support students throughout the visa application process.' },
        { q: 'Is health insurance required for students?', a: 'Yes, health insurance is mandatory for all students in Switzerland. Students must obtain coverage that meets Swiss legal requirements upon arrival.' },
      ],
    },
    {
      id: 'accommodation',
      title: 'Accommodation',
      items: [
        { q: 'What accommodation options are available for students?', a: 'Students can choose from a range of accommodation options in and around La Tour-de-Peilz and nearby areas such as Vevey. These include shared apartments and private housing, depending on availability and budget.' },
        { q: 'Does Helvetic Tech provide accommodation?', a: 'Helvetic Tech offers a limited number of accommodation options reserved for its students, allocated on a first-come, first-served basis. The institution also provides guidance to help students find suitable housing in the surrounding area.' },
        { q: 'Where is student accommodation located?', a: 'Accommodation is typically located close to the campus or within short commuting distance, particularly in La Tour-de-Peilz and surrounding areas.' },
      ],
    },
    {
      id: 'registration',
      title: 'Registration and enrolment',
      items: [
        { q: 'When do programs start?', a: 'Helvetic Tech offers three intakes per year, in September, January, and April.' },
        { q: 'How do I complete my enrolment?', a: 'After receiving an offer, students must confirm their place by completing the required administrative steps, including submitting documents and paying the admission fee.' },
        { q: 'When will I receive my timetable?', a: 'Students typically receive their timetable during the registration week before the start of the academic term.' },
      ],
    },
    {
      id: 'arrival',
      title: 'Arrival in Switzerland',
      items: [
        { q: 'When should I arrive in Switzerland?', a: 'Students are advised to arrive at least one week before the start of the term to complete administrative formalities and settle in.' },
        { q: 'What is the nearest airport to Helvetic Tech?', a: 'Geneva Airport is the closest international airport, with direct train connections to La Tour-de-Peilz.' },
        { q: 'What happens after arrival?', a: 'Upon arrival, students receive guidance on registration, residence permits, and orientation to help them transition smoothly into student life.' },
      ],
    },
    {
      id: 'experience',
      title: 'Student experience',
      items: [
        { q: 'What is the study format at Helvetic Tech?', a: 'Programs are delivered in a blended format that combines on-campus learning with online components, offering both structure and flexibility.' },
        { q: 'What is the class size?', a: 'Helvetic Tech maintains small class sizes to ensure personalized support, close interaction with faculty, and an effective learning environment.' },
        { q: 'What support services are available to students?', a: 'Students benefit from academic support, mentorship, and career guidance throughout their studies, as well as assistance with administrative and practical aspects of student life.' },
      ],
    },
  ],
};

const bachelorFacts = [
  { title: 'Duration', text: '3 years' },
  { title: 'Credits', text: '135 CH | 180 ECTS' },
  { title: 'Structure', text: '9 academic terms' },
];

const masterFacts = [
  { title: 'Duration', text: '2 years' },
  { title: 'Credits', text: '90 CH | 120 ECTS' },
];

export const BACHELOR_CYBERSECURITY = {
  route: 'programs/bachelor-in-cybersecurity',
  kind: 'program',
  level: 'Bachelor',
  discipline: 'Cybersecurity',
  title: 'Bachelor of Science in Cybersecurity',
  description: 'The Bachelor of Science in Cybersecurity at the Helvetic Institute of Technology is designed for students who want to build the knowledge and practical skills needed to protect digital systems, networks, and data in an increasingly connected world.',
  descriptionMore: 'Through a hands-on, project-based approach, students engage with cybersecurity challenges such as threat analysis, forensic investigation, and cloud infrastructure security.',
  overview: 'The program combines academic foundations with applied learning, helping students understand how cybersecurity operates in real professional environments.',
  overviewMore: 'The learning experience is designed to reflect real-world cybersecurity environments and to support the development of both technical depth and strategic thinking.',
  facts: bachelorFacts,
  outcomes: ['A solid understanding of cybersecurity concepts and technologies', 'The ability to identify and respond to security threats and vulnerabilities', 'Experience with network security, cyber defense, and risk management', 'Problem-solving and analytical skills in technology-driven environments', 'Practical experience through hands-on projects and applied learning'],
  curriculum: [
    { title: 'Foundations', text: 'Programming fundamentals · Networking basics · Systems and data fundamentals' },
    { title: 'Cybersecurity', text: 'Network security · Cyber defense · Threat detection and analysis' },
    { title: 'Applied learning', text: 'Core courses · Electives · Capstone project' },
  ],
  careers: ['Cybersecurity Analyst', 'Information Security Specialist', 'Network Security Engineer', 'Cyber Risk Consultant', 'Security Operations Analyst', 'IT Security Administrator'],
  source: SOURCES.bachelorCybersecurity,
};

export const BACHELOR_BLOCKCHAIN = {
  route: 'programs/bachelor-in-blockchain',
  kind: 'program',
  level: 'Bachelor',
  discipline: 'Blockchain',
  title: 'Bachelor of Science in Blockchain',
  description: 'The Bachelor of Science in Blockchain at the Helvetic Institute of Technology is designed for students who want to understand and build the next generation of decentralized technologies.',
  descriptionMore: 'Students develop both technical expertise and practical problem-solving skills through a hands-on learning approach.',
  overview: 'The program provides a strong foundation in blockchain systems, distributed networks, and cryptographic principles, while also addressing the growing role of blockchain across industries.',
  overviewMore: 'From early in the program, students work on projects involving blockchain architecture, smart contracts, and decentralized applications, gaining experience that reflects how blockchain is used in real-world environments.',
  facts: bachelorFacts,
  outcomes: ['A solid understanding of blockchain concepts and distributed technologies', 'The ability to understand and work with decentralized systems', 'Experience with blockchain architecture, cryptographic principles, and distributed networks', 'Problem-solving and analytical skills in technology-driven environments', 'Practical experience through hands-on projects and applied learning'],
  curriculum: [
    { title: 'Foundations', text: 'Programming fundamentals · Data structures and systems fundamentals · Introduction to distributed systems' },
    { title: 'Blockchain technologies', text: 'Blockchain architecture · Cryptographic principles · Consensus mechanisms' },
    { title: 'Applied learning', text: 'Core courses · Electives · Capstone project' },
  ],
  careers: ['Blockchain Developer', 'Blockchain Analyst', 'Distributed Systems Specialist', 'Technology Consultant', 'Digital Innovation Analyst'],
  source: SOURCES.bachelorBlockchain,
};

export const MASTER_AI = {
  route: 'programs/master-in-artificial-intelligence',
  kind: 'program',
  level: 'Master',
  discipline: 'Artificial Intelligence',
  title: 'Master of Science in Artificial Intelligence',
  description: 'The Master of Science in Artificial Intelligence at the Helvetic Institute of Technology is designed for students who want to develop advanced knowledge and practical expertise in artificial intelligence and data-driven technologies.',
  descriptionMore: 'Students engage with key areas such as machine learning, neural networks, and data analysis, while developing the ability to design, evaluate, and implement AI-driven solutions.',
  overview: 'The program focuses on both technical depth and real-world application, preparing students to work with complex AI systems and evolving digital environments.',
  overviewMore: 'The learning approach combines academic rigor with hands-on projects, ensuring that students can apply their knowledge in practical contexts.',
  facts: masterFacts,
  outcomes: ['An advanced understanding of artificial intelligence and data-driven technologies', 'The ability to design and evaluate AI-based solutions', 'Knowledge of machine learning, neural networks, and data science', 'Analytical and problem-solving skills in complex technology-driven environments', 'Practical experience through applied projects and real-world case studies'],
  curriculum: [
    { title: 'Core concepts', text: 'Data science · Statistical methods · System design principles' },
    { title: 'Advanced AI', text: 'Machine learning · Neural networks' },
    { title: 'Applied learning', text: 'Core courses · Electives · Final capstone project' },
  ],
  careers: ['Machine Learning Engineer', 'Data Scientist', 'AI Engineer', 'Computer Vision Engineer', 'AI Consultant'],
  source: SOURCES.masterAi,
};

export const MASTER_CYBERSECURITY = {
  route: 'programs/master-in-cybersecurity',
  kind: 'program',
  level: 'Master',
  discipline: 'Cybersecurity',
  title: 'Master of Science in Cybersecurity',
  description: 'The Master of Science in Cybersecurity at the Helvetic Institute of Technology is designed for students who want to develop advanced expertise in protecting digital systems, networks, and data in an increasingly complex threat landscape.',
  descriptionMore: 'Students engage with key areas such as network security, cryptography, and cyber defense, while developing the ability to analyze, prevent, and respond to security threats.',
  overview: 'The program focuses on both technical depth and real-world application, preparing students to address modern cybersecurity challenges.',
  overviewMore: 'The learning approach combines academic rigor with hands-on projects and real-world scenarios, ensuring that students can apply their knowledge in practical environments.',
  facts: [...masterFacts, { title: 'Structure', text: '6 academic terms' }],
  outcomes: ['An advanced understanding of cybersecurity concepts and technologies', 'The ability to identify, prevent, and respond to cyber threats', 'Knowledge of network security, cryptography, and cyber defense', 'Analytical and problem-solving skills in complex security environments', 'Practical experience through applied projects and real-world cybersecurity scenarios'],
  curriculum: [
    { title: 'Systems', text: 'Network systems · Security principles · Systems architecture' },
    { title: 'Cyber defense', text: 'Network security · Cryptography · Cyber defense' },
    { title: 'Response and strategy', text: 'Threat detection · Incident response · Security strategy' },
  ],
  careers: ['Cybersecurity Analyst', 'Security Engineer', 'Threat Intelligence Specialist', 'Cyber Risk Consultant', 'Security Operations Specialist'],
  source: SOURCES.masterCybersecurity,
};

export const MASTER_BLOCKCHAIN = {
  route: 'programs/master-in-blockchain',
  kind: 'program',
  level: 'Master',
  discipline: 'Blockchain',
  title: 'Master of Science in Blockchain',
  description: 'The Master of Science in Blockchain at the Helvetic Institute of Technology is designed for students who want to deepen their understanding of decentralized technologies and develop advanced skills in blockchain systems.',
  descriptionMore: 'Students engage with advanced topics such as blockchain architecture, cryptographic protocols, and decentralized applications, while developing the ability to analyze, design, and implement blockchain-based solutions.',
  overview: 'The program focuses on both the technical and strategic aspects of blockchain, preparing students to work with complex distributed infrastructures and emerging digital ecosystems.',
  overviewMore: 'The learning approach combines academic depth with practical application, ensuring that students can apply their knowledge in real-world contexts.',
  facts: [...masterFacts, { title: 'Structure', text: '6 academic terms' }],
  outcomes: ['An advanced understanding of blockchain technologies and distributed systems', 'The ability to design and evaluate decentralized solutions', 'Knowledge of blockchain architecture, cryptographic principles, and consensus mechanisms', 'Analytical and problem-solving skills in complex technology-driven environments', 'Practical experience through applied projects and real-world case studies'],
  curriculum: [
    { title: 'Systems', text: 'Distributed systems concepts · Advanced data structures · System design principles' },
    { title: 'Advanced blockchain', text: 'Blockchain architecture · Cryptographic principles' },
    { title: 'Applied learning', text: 'Core courses · Electives · Final capstone project' },
  ],
  careers: ['Blockchain Developer', 'Blockchain Architect', 'Distributed Systems Specialist', 'Blockchain Consultant', 'Digital Innovation Manager'],
  source: SOURCES.masterBlockchain,
};

export const GOVERNANCE = {
  route: 'governance', kind: 'content', title: 'Governance',
  description: 'The Management Committee acts as the principal decision-making body of Helvetic Tech.',
  source: SOURCES.governance,
  sections: [
    { title: 'Management committee', text: 'The Management Committee acts as the principal decision-making body of Helvetic Tech. It is responsible for the institution’s strategic direction and provides oversight of academic affairs, research activities, administrative functions, and the allocation of institutional resources.' },
    { title: 'Composition', items: ['Dr. Kevin Koidl — Dean of Academics', 'Dr. Anca Prisacariu — Quality Assurance Director', 'Dr Killian Levacher — AI Expert', 'Echesirim Izuchukwu — Industry Expert'] },
  ],
};

export const VACANCIES = {
  route: 'job-vacancies', kind: 'content', title: 'Job Vacancies',
  description: 'The Helvetic Institute of Technology welcomes spontaneous applications from qualified candidates interested in joining the institution.',
  source: SOURCES.vacancies,
  sections: [
    { title: 'Job Vacancies', text: 'The Helvetic Institute of Technology welcomes spontaneous applications from qualified candidates interested in joining the institution. If you wish to apply, please submit your complete application, including your CV and cover letter.' },
    { title: 'Current openings', text: 'For information on current openings and advertised roles, please visit our LinkedIn page.', link: { label: 'Submit a Spontaneous Application', href: 'mailto:info@helvetictech.ch?subject=Spontaneous%20Application' } },
  ],
};

export const STUDENT_SERVICES = {
  route: 'student-services', kind: 'content', title: 'Student Services',
  description: 'Our Student Services team is dedicated to supporting every aspect of your experience beyond the classroom.',
  source: SOURCES.studentServices,
  sections: [
    { title: 'Introduction', text: 'At the Helvetic Institute of Technology, we recognize that moving to a new country for your studies is both an exciting opportunity and a significant transition. Our Student Services team is dedicated to supporting every aspect of your experience beyond the classroom, allowing you to focus on your academic progress and personal development.' },
    { title: 'Our commitment to you', text: 'The Helvetic Institute of Technology is committed to providing comprehensive support that addresses the practical, administrative, and personal needs of an international student community.' },
    { title: 'Service areas', items: ['Accommodation', 'Visa & Immigration', 'Health Insurance', 'Academic Advising', 'Personal Well-being', 'Orientation', 'Student ID & Benefits'] },
    { title: 'Accommodation services', text: 'A limited number of accommodation options are reserved for students and are allocated on a first-come, first-served basis. Early application is therefore strongly recommended.' },
    { title: 'Visa and immigration support', text: 'Student Services provides step-by-step guidance throughout the process, from the initial visa application to residence permit procedures during your studies.' },
    { title: 'Health insurance guidance', text: 'Health insurance is mandatory for all residents in Switzerland, including students. The Helvetic Institute of Technology assists students in understanding available options and selecting coverage that meets both legal requirements and individual needs.' },
    { title: 'Academic advising', text: 'Students have access to academic advising throughout their studies. Advisors provide guidance on course selection, program structure, and academic progression.' },
    { title: 'Orientation and onboarding', text: 'Each intake begins with a structured orientation designed to introduce students to the campus, academic environment, and life in Switzerland.' },
  ],
};

export const STUDENTS = {
  route: 'students', kind: 'content', title: 'Students',
  description: 'At Helvetic Tech, students are at the center of the learning experience.',
  source: SOURCES.students,
  sections: [
    { title: 'Introduction', text: 'At Helvetic Tech, students are at the center of the learning experience. The environment is designed to bring together motivated individuals who share an interest in technology and innovation.' },
    { title: 'Who are Helvetic Tech students?', text: 'Helvetic Tech attracts individuals seeking a structured, technology-oriented education in an international context. Students come with different academic paths and experiences, but are united by a common objective: to develop relevant skills and prepare for evolving professional environments.' },
    { title: 'A focused learning environment', text: 'Students are actively involved in discussions, group work, and projects, allowing them to engage directly with the material and with each other.' },
    { title: 'Student support', items: ['Academic guidance and program support', 'Assistance with accommodation and administrative processes', 'Access to faculty for academic and practical questions', 'A collaborative student environment'] },
    { title: 'Life beyond the classroom', text: 'Located on the shores of Lake Geneva, Helvetic Tech offers an environment that combines academic focus with quality of life.' },
  ],
};

export const INSTITUTIONAL_DEVELOPMENT = {
  route: 'institutional-development', kind: 'content', title: 'Institutional Development',
  description: 'Helvetic Tech is a recently established institution designed to respond to the current and future demands of technology-driven industries.',
  source: SOURCES.institutionalDevelopment,
  sections: [
    { title: 'A modern approach to development', text: 'Helvetic Tech is structured to evolve alongside the industries it serves. Its development focuses on maintaining flexibility in program design and continuously aligning academic content with technological advancements.' },
    { title: 'Academic program development', text: 'Programs at Helvetic Tech are built around current and emerging areas of technology, including artificial intelligence, cybersecurity, and blockchain.' },
    { title: 'Educational partnerships', text: 'Helvetic Tech operates in partnership with Tiffin University, offering a dual-degree structure that combines a Swiss qualification with a US-accredited degree.' },
    { title: 'Quality and continuous improvement', text: 'Helvetic Tech implements structured processes to monitor and improve its academic and operational activities.' },
    { title: 'Faculty and learning environment', text: 'Faculty at Helvetic Tech are active professionals, ensuring that teaching remains connected to current industry practices.' },
    { title: 'Technology integration', text: 'Technology is central to both the curriculum and the overall learning experience.' },
    { title: 'Student environment and support', text: 'Helvetic Tech provides a structured and supportive environment for students, with services designed to facilitate both academic progression and adaptation to life in Switzerland.' },
  ],
};

export const ALUMNI = {
  route: 'alumni', kind: 'content', title: 'Alumni',
  description: 'Helvetic alumni form a powerful, diverse, and deeply connected professional network that continues to grow with every graduating class.',
  source: SOURCES.alumni,
  sections: [
    { title: 'The Helvetic alumni network', text: 'The Helvetic alumni network is a global community of business professionals who share the experience of earning a dual Swiss and American degree in one of the world’s most prestigious settings.' },
    { title: 'Where our alumni work', text: 'Helvetic alumni have built careers at some of the world’s most respected and influential organizations.' },
    { title: 'Alumni success and impact', text: 'The success of Helvetic alumni is reflected not only in the organizations they join but in the leadership roles they assume and the impact they create.' },
    { title: 'Staying connected', text: 'Helvetic maintains active communication channels with its alumni community through regular newsletters, social media engagement, and dedicated alumni platforms.' },
    { title: 'Alumni events and reunions', text: 'Helvetic organizes alumni events and reunions throughout the year, both on campus and in key cities around the world.' },
    { title: 'Mentorship and giving back', text: 'By sharing their professional experiences, career advice, and industry insights with current students, alumni play a direct role in shaping the next generation of business leaders.' },
  ],
};

export const FEES = {
  route: 'financing/fees-expenses', kind: 'content', title: 'Fees & Expenses',
  description: 'Understanding the cost of your studies is an essential part of planning your academic journey.',
  source: SOURCES.fees,
  sections: [
    { title: 'Overview', text: 'At Helvetic Tech, tuition is structured in a transparent and straightforward way, allowing students to clearly anticipate both academic fees and living expenses in Switzerland.' },
    { title: 'Dual degree value', text: 'Students benefit from a dual-degree structure combining a Swiss qualification with a degree from Tiffin University.' },
    { title: 'Tuition fees', items: ['Bachelor: CHF 6’850 per term · CHF 20’550 per year · 3 years full-time', 'Master: CHF 7’350 per term · CHF 22’050 per year · 2 years full-time'] },
    { title: 'Admission fees', items: ['Application fee: CHF 250', 'Admission fee: CHF 1’000'] },
    { title: 'What is included', items: ['Academic instruction', 'Access to campus facilities', 'Learning platforms and academic resources'] },
    { title: 'Living expenses', items: ['Accommodation: from CHF 750', 'Health insurance: from CHF 150', 'Food: CHF 200 – 750', 'Transportation: from CHF 80', 'Personal expenses: varies'] },
    { title: 'Return on investment', text: 'The return on investment is measured not only in the degree obtained, but in the combination of skills, exposure, and positioning that supports long-term career development.' },
  ],
};

export const SCHOLARSHIPS = {
  route: 'financing/scholarships', kind: 'content', title: 'Scholarships & Funding',
  description: 'Helvetic Tech offers a limited number of scholarships to support outstanding candidates.',
  source: SOURCES.scholarships,
  sections: [
    { title: 'Exceptional candidate support', text: 'Scholarships are awarded on a competitive basis and are not guaranteed. Each application is assessed individually, with consideration given to academic performance, professional profile, and overall alignment with the institution.' },
    { title: 'Scholarship approach', text: 'Scholarships are granted based on a combination of merit, experience, and the ability to contribute to a dynamic and international academic environment.' },
    { title: 'Merit-based scholarship', items: ['Academic performance and consistency', 'Motivation and clarity of career goals', 'Professional or extracurricular experience', 'Ability to contribute to a collaborative learning environment', 'Adaptability to an international setting'] },
    { title: 'Women in technology scholarship', text: 'This scholarship is awarded to female candidates who demonstrate strong potential to pursue careers in areas such as artificial intelligence, cybersecurity, data, or digital innovation.' },
    { title: 'High-achiever consideration', items: ['Top academic results or equivalent performance', 'Strong intellectual engagement', 'Consistency in academic achievements'] },
    { title: 'Application process', text: 'Scholarship consideration is integrated into the admissions process. Applicants do not apply for specific scholarships but are evaluated based on their overall profile.' },
  ],
};

export const PAGES = [
  HOME,
  PROGRAMS_PAGE,
  BACHELOR_AI,
  ADMISSIONS,
  INSTITUTE,
  CAMPUS_LIFE,
  FACULTY,
  POLICIES,
  FAQ,
  CONTACT,
  INSIGHTS,
  BACHELOR_CYBERSECURITY,
  BACHELOR_BLOCKCHAIN,
  MASTER_AI,
  MASTER_CYBERSECURITY,
  MASTER_BLOCKCHAIN,
  GOVERNANCE,
  VACANCIES,
  STUDENT_SERVICES,
  STUDENTS,
  INSTITUTIONAL_DEVELOPMENT,
  ALUMNI,
  FEES,
  SCHOLARSHIPS,
];
