import { useMemo, useState } from "react";

type Tone = "keyword" | "type" | "string" | "comment" | "plain";

type TextSegment = {
  kind: "text";
  text: string;
  tone?: Tone;
};

type BlankSegment = {
  kind: "blank";
  id: string;
};

type Segment = TextSegment | BlankSegment;

type BlankConfig = {
  id: string;
  label: string;
  correct: string;
  options: string[];
};

type ChoiceExercise = {
  kind: "choice";
  prompt: string;
  options: string[];
  correct: string;
  explanation: string;
};

type CodeExercise = {
  kind: "code";
  prompt: string;
  explanation: string;
  snippet: Segment[][];
  blanks: BlankConfig[];
};

type Exercise = ChoiceExercise | CodeExercise;

type Chapter = {
  id: string;
  title: string;
  subtitle: string;
  courseTitle: string;
  overview: string;
  lessons: string[];
  exampleTitle: string;
  exampleCode: string[];
  takeaway: string;
  exercise: Exercise;
};

type FeedbackKind = "idle" | "info" | "success" | "warning" | "error";

type Feedback = {
  kind: FeedbackKind;
  text: string;
};

const toneClass: Record<Tone, string> = {
  keyword: "text-violet-300",
  type: "text-cyan-300",
  string: "text-amber-300",
  comment: "text-slate-500",
  plain: "text-slate-100",
};

const chapters: Chapter[] = [
  {
    id: "intro-java",
    title: "1. C'est quoi Java ?",
    subtitle: "Comprendre le langage avant d'ecrire la premiere ligne.",
    courseTitle: "Le point de depart",
    overview:
      "Java est un langage de programmation qui permet de creer des applis, des sites, des outils et des jeux. On ecrit du code, la machine le compile en bytecode, puis la JVM le fait tourner.",
    lessons: [
      "Java = un langage pour parler a l'ordinateur avec des regles precises.",
      "Bytecode = le code intermediaire genere apres compilation.",
      "JVM = la machine virtuelle qui execute le bytecode.",
    ],
    exampleTitle: "Premier programme",
    exampleCode: [
      "public class Main {",
      "  public static void main(String[] args) {",
      '    System.out.println("Bonjour Java !");',
      "  }",
      "}",
    ],
    takeaway:
      "Tu n'as pas besoin de tout comprendre d'un coup. Retient seulement que Java s'ecrit, se compile, puis s'exécute via la JVM.",
    exercise: {
      kind: "choice",
      prompt: "Quel composant permet d'executer un programme Java compile ?",
      options: ["La JVM", "Le navigateur", "Le fichier .png"],
      correct: "La JVM",
      explanation:
        "La JVM (Java Virtual Machine) lit le bytecode et lance le programme sur la machine.",
    },
  },
  {
    id: "compile-run",
    title: "2. Compiler et lancer",
    subtitle: "Ecrire un fichier .java, le compiler, puis le lancer.",
    courseTitle: "La chaine de compilation",
    overview:
      "Un fichier Java source se termine souvent par .java. On le compile avec javac, ce qui produit un bytecode. Ensuite on le lance avec java.",
    lessons: [
      "javac transforme le code source en bytecode.",
      "java lance la classe compilee.",
      "Le nom du fichier et le nom de la classe publique doivent correspondre.",
    ],
    exampleTitle: "Deux commandes a connaitre",
    exampleCode: ["javac Main.java", "java Main"],
    takeaway:
      "Si tu vois une erreur de compilation, relis le nom de la classe, les accolades et les points-virgules.",
    exercise: {
      kind: "code",
      prompt: "Complete les commandes pour compiler puis lancer le programme.",
      explanation: "javac compile le fichier source et java execute la classe compilee.",
      blanks: [
        {
          id: "compile-1",
          label: "commande de compilation",
          correct: "javac",
          options: ["javac", "java", "javadoc"],
        },
        {
          id: "compile-2",
          label: "commande d'execution",
          correct: "java",
          options: ["javac", "java", "jar"],
        },
      ],
      snippet: [
        [{ kind: "blank", id: "compile-1" }, { kind: "text", text: " Main.java", tone: "plain" }],
        [{ kind: "blank", id: "compile-2" }, { kind: "text", text: " Main", tone: "plain" }],
      ],
    },
  },
  {
    id: "variables",
    title: "3. Variables",
    subtitle: "Stocker des nombres, du texte et des valeurs vrai/faux.",
    courseTitle: "La memoire du programme",
    overview:
      "Une variable est une boite qui garde une valeur. En Java, on choisit son type selon ce qu'on veut stocker.",
    lessons: [
      "int pour les nombres entiers.",
      "double pour les nombres decimaux.",
      "boolean pour vrai ou faux.",
      "String pour le texte.",
    ],
    exampleTitle: "Quelques declarations",
    exampleCode: [
      'int age = 12;',
      'double prix = 4.99;',
      'boolean actif = true;',
      'String prenom = "Lina";',
    ],
    takeaway:
      "Le type doit correspondre a la valeur. C'est la base pour eviter des erreurs simples.",
    exercise: {
      kind: "choice",
      prompt: "Quel type faut-il utiliser pour stocker du texte en Java ?",
      options: ["String", "int", "boolean"],
      correct: "String",
      explanation:
        "String sert a manipuler des mots, phrases et textes entre guillemets.",
    },
  },
  {
    id: "conditions",
    title: "4. Conditions",
    subtitle: "Faire une action seulement si une condition est vraie.",
    courseTitle: "Le premier vrai test",
    overview:
      "Les conditions permettent a ton programme de faire des choix. On utilise if, else if et else avec des comparateurs.",
    lessons: [
      "if teste une condition.",
      ">= veut dire plus grand ou egal.",
      "== compare deux valeurs.",
    ],
    exampleTitle: "Exemple simple",
    exampleCode: [
      "if (score >= 10) {",
      '  System.out.println("Bravo !");',
      "} else {",
      '  System.out.println("Continue.");',
      "}",
    ],
    takeaway:
      "Les conditions rendent le programme interactif et adaptatif.",
    exercise: {
      kind: "code",
      prompt: "Choisis le bon comparateur pour autoriser un joueur a partir de 10 points.",
      explanation: ">= verifie que la valeur est superieure ou egale a 10.",
      blanks: [
        {
          id: "cond-1",
          label: "comparateur",
          correct: ">=",
          options: [">=", "=", "=>"],
        },
      ],
      snippet: [
        [
          { kind: "text", text: "if (score ", tone: "keyword" },
          { kind: "blank", id: "cond-1" },
          { kind: "text", text: " 10) {", tone: "plain" },
        ],
        [{ kind: "text", text: '  System.out.println("Niveau suivant !");', tone: "string" }],
      ],
    },
  },
  {
    id: "loops",
    title: "5. Boucles",
    subtitle: "Repeter une action sans recopier le code.",
    courseTitle: "Repetitions intelligentes",
    overview:
      "Une boucle repete du code tant qu'une condition est vraie. La plus connue pour debuter est la boucle for.",
    lessons: [
      "for sert a repeter un nombre precis de fois.",
      "i++ augmente i de 1.",
      "while repete tant qu'une condition reste vraie.",
    ],
    exampleTitle: "Boucle de 3 tours",
    exampleCode: [
      "for (int i = 0; i < 3; i++) {",
      '  System.out.println("Tour " + i);',
      "}",
    ],
    takeaway:
      "Les boucles evitent la repetition inutile et rendent le code plus propre.",
    exercise: {
      kind: "code",
      prompt: "Complete la boucle for pour afficher 3 tours.",
      explanation: "On initialise i a 0, on teste i < 3, puis on ajoute 1 avec i++.",
      blanks: [
        {
          id: "loop-1",
          label: "initialisation",
          correct: "=",
          options: ["=", "==", "!="],
        },
        {
          id: "loop-2",
          label: "incrementation",
          correct: "++",
          options: ["++", "--", "+="],
        },
      ],
      snippet: [
        [
          { kind: "text", text: "for (int i ", tone: "keyword" },
          { kind: "blank", id: "loop-1" },
          { kind: "text", text: " 0; i < 3; i", tone: "plain" },
          { kind: "blank", id: "loop-2" },
          { kind: "text", text: ") {", tone: "plain" },
        ],
        [{ kind: "text", text: '  System.out.println("Tour " + i);', tone: "string" }],
      ],
    },
  },
  {
    id: "methods",
    title: "6. Methodes",
    subtitle: "Ranger une action dans une fonction reutilisable.",
    courseTitle: "Des blocs de code reutilisables",
    overview:
      "Une methode regroupe des instructions pour pouvoir les reutiliser sans les recopier. Elle peut recevoir des parametres et renvoyer une valeur.",
    lessons: [
      "void veut dire qu'une methode ne renvoie rien.",
      "Le mot return renvoie une valeur.",
      "Les parametres permettent d'envoyer des donnees a la methode.",
    ],
    exampleTitle: "Methode simple",
    exampleCode: [
      "public static int bonus(int base) {",
      "  return base + 5;",
      "}",
      "",
      'System.out.println(bonus(10));',
    ],
    takeaway:
      "Les methodes aident a organiser le code et a eviter les doublons.",
    exercise: {
      kind: "choice",
      prompt: "Quel mot-clé indique qu'une methode ne renvoie rien ?",
      options: ["void", "int", "new"],
      correct: "void",
      explanation: "void est utilise quand la methode fait une action sans retourner de valeur.",
    },
  },
  {
    id: "arrays",
    title: "7. Tableaux",
    subtitle: "Ranger plusieurs valeurs dans une seule variable.",
    courseTitle: "Les listes simples",
    overview:
      "Un tableau permet de stocker plusieurs elements du meme type. L'index de depart est 0, pas 1.",
    lessons: [
      "Les tableaux ont une taille fixe.",
      "Le premier element est a l'index 0.",
      "On accede a une case avec des crochets.",
    ],
    exampleTitle: "Lire un element",
    exampleCode: [
      'String[] couleurs = {"rouge", "bleu", "vert"};',
      'System.out.println(couleurs[1]);',
    ],
    takeaway:
      "Quand tu veux parcourir plusieurs valeurs, les tableaux sont souvent la premiere solution.",
    exercise: {
      kind: "choice",
      prompt: "Quel index donne le deuxieme element d'un tableau ?",
      options: ["1", "2", "0"],
      correct: "1",
      explanation: "Le comptage commence a 0, donc le deuxieme element est a l'index 1.",
    },
  },
  {
    id: "oop",
    title: "8. POO",
    subtitle: "Comprendre les classes, objets et constructeurs.",
    courseTitle: "La programmation orientee objet",
    overview:
      "La POO permet de modeliser le monde avec des classes. Une classe est un plan, et un objet est une instance creee a partir de ce plan.",
    lessons: [
      "class definit un modele.",
      "new cree un objet.",
      "this sert a parler de l'objet courant.",
    ],
    exampleTitle: "Classe et objet",
    exampleCode: [
      "public class Hero {",
      "  String nom;",
      "  public Hero(String nom) {",
      "    this.nom = nom;",
      "  }",
      "}",
      "",
      'Hero h = new Hero("Nina");',
    ],
    takeaway:
      "Avec la POO, tu peux construire des objets qui representent des personnages, des outils, des vehicules ou des ennemis.",
    exercise: {
      kind: "code",
      prompt: "Complete la classe et la creation d'objet.",
      explanation:
        "class declare une classe, et new construit une nouvelle instance de cette classe.",
      blanks: [
        {
          id: "oop-1",
          label: "mot-clé de classe",
          correct: "class",
          options: ["class", "object", "struct"],
        },
        {
          id: "oop-2",
          label: "creation d'objet",
          correct: "new",
          options: ["new", "make", "spawn"],
        },
      ],
      snippet: [
        [
          { kind: "text", text: "public ", tone: "keyword" },
          { kind: "blank", id: "oop-1" },
          { kind: "text", text: " Hero {", tone: "type" },
        ],
        [{ kind: "text", text: "  String nom;", tone: "plain" }],
        [{ kind: "text", text: "  public Hero(String nom) {", tone: "plain" }],
        [{ kind: "text", text: "    this.nom = nom;", tone: "plain" }],
        [{ kind: "text", text: "  }", tone: "plain" }],
        [{ kind: "text", text: "}", tone: "plain" }],
        [
          { kind: "text", text: "Hero h = ", tone: "plain" },
          { kind: "blank", id: "oop-2" },
          { kind: "text", text: ' Hero("Nina");', tone: "plain" },
        ],
      ],
    },
  },
];

function createAnswerState(chapter: Chapter) {
  const base: Record<string, string> = {};

  if (chapter.exercise.kind === "choice") {
    base.choice = "";
    return base;
  }

  chapter.exercise.blanks.forEach((blank) => {
    base[blank.id] = "";
  });

  return base;
}

function createEmptyFeedback(): Feedback {
  return { kind: "idle", text: "Lis le cours puis lance l'exercice quand tu te sens pret." };
}

function statusLabel(index: number, currentIndex: number, unlockedIndex: number, completed: boolean) {
  if (completed) return "Valide";
  if (index === currentIndex) return "En cours";
  if (index <= unlockedIndex) return "Deja ouvert";
  return "Verrouille";
}

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedIndices, setCompletedIndices] = useState<number[]>([]);
  const [answersByChapter, setAnswersByChapter] = useState<Record<string, Record<string, string>>>({});
  const [selectedChoice, setSelectedChoice] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<Feedback>(createEmptyFeedback());

  const currentChapter = chapters[currentIndex];
  const allCompleted = completedIndices.length === chapters.length;
  const unlockedIndex = completedIndices.length;

  const totalProgress = useMemo(
    () => Math.round((completedIndices.length / chapters.length) * 100),
    [completedIndices.length]
  );

  const currentAnswers = answersByChapter[currentChapter.id] ?? createAnswerState(currentChapter);
  const currentChoice = selectedChoice[currentChapter.id] ?? "";
  const currentCompleted = completedIndices.includes(currentIndex);

  const selectChapter = (index: number) => {
    if (index > unlockedIndex) return;
    setCurrentIndex(index);
    setFeedback(createEmptyFeedback());
  };

  const saveCurrentAnswers = (nextAnswers: Record<string, string>) => {
    setAnswersByChapter((prev) => ({
      ...prev,
      [currentChapter.id]: nextAnswers,
    }));
  };

  const validateChapter = () => {
    if (currentChapter.exercise.kind === "choice") {
      if (!currentChoice) {
        setFeedback({ kind: "warning", text: "Choisis une reponse avant de valider." });
        return;
      }

      if (currentChoice === currentChapter.exercise.correct) {
        setCompletedIndices((prev) => (prev.includes(currentIndex) ? prev : [...prev, currentIndex]));

        setFeedback({
          kind: "success",
          text: `Bravo. ${currentChapter.exercise.explanation}`,
        });
        return;
      }

      setFeedback({
        kind: "error",
        text: `Pas encore. ${currentChapter.exercise.explanation}`,
      });
      return;
    }

    const missing = currentChapter.exercise.blanks.filter((blank) => !currentAnswers[blank.id]);

    if (missing.length > 0) {
      setFeedback({ kind: "warning", text: "Il manque encore des cases a remplir." });
      return;
    }

    const wrong = currentChapter.exercise.blanks.find((blank) => currentAnswers[blank.id] !== blank.correct);

    if (wrong) {
      setFeedback({
        kind: "error",
        text: `Attention, la bonne reponse pour "${wrong.label}" est "${wrong.correct}".`,
      });
      return;
    }

    setCompletedIndices((prev) => (prev.includes(currentIndex) ? prev : [...prev, currentIndex]));

    setFeedback({
      kind: "success",
      text: `Bien joue. ${currentChapter.exercise.explanation}`,
    });
  };

  const handleNext = () => {
    if (currentIndex < chapters.length - 1) {
      setCurrentIndex((value) => value + 1);
      setFeedback(createEmptyFeedback());
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setCompletedIndices([]);
    setAnswersByChapter({});
    setSelectedChoice({});
    setFeedback(createEmptyFeedback());
  };

  const handleChoice = (chapterId: string, option: string) => {
    setSelectedChoice((prev) => ({ ...prev, [chapterId]: option }));
  };

  const handleBlankChange = (blankId: string, value: string) => {
    const nextAnswers = { ...currentAnswers, [blankId]: value };
    saveCurrentAnswers(nextAnswers);
  };

  const renderCodeLine = (line: Segment[], lineIndex: number) => (
    <div key={lineIndex} className="flex items-start gap-3">
      <span className="w-7 shrink-0 select-none text-right text-slate-600">{lineIndex + 1}</span>
      <div className="min-w-0 flex-1 whitespace-pre-wrap break-words">
        {line.map((segment, segmentIndex) => {
          if (segment.kind === "text") {
            return (
              <span key={`${lineIndex}-${segmentIndex}`} className={toneClass[segment.tone ?? "plain"]}>
                {segment.text}
              </span>
            );
          }

          const blank = currentChapter.exercise.kind === "code"
            ? currentChapter.exercise.blanks.find((item) => item.id === segment.id)
            : undefined;

          if (!blank) return null;

          const width = Math.max(
            132,
            blank.options.reduce((max, option) => Math.max(max, option.length), 0) * 8 + 42
          );
          const value = currentAnswers[blank.id] ?? "";
          const isSolved = currentCompleted && value === blank.correct;
          const borderClass = isSolved
            ? "border-emerald-400/60 bg-emerald-500/10 text-emerald-50"
            : "border-white/10 bg-slate-900/90 text-slate-100";

          return (
            <select
              key={blank.id}
              value={value}
              onChange={(event) => handleBlankChange(blank.id, event.target.value)}
              className={`mx-1 inline-flex rounded-lg border px-3 py-1.5 text-sm font-medium outline-none transition duration-200 focus:border-cyan-300/80 focus:shadow-[0_0_0_3px_rgba(34,211,238,0.16)] ${borderClass}`}
              style={{ width }}
            >
              <option value="" disabled>
                {blank.label}
              </option>
              {blank.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050816] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.18),transparent_28%),radial-gradient(circle_at_right,rgba(34,211,238,0.14),transparent_24%),radial-gradient(circle_at_bottom,rgba(59,130,246,0.08),transparent_28%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:64px_64px] opacity-35" />
      <div className="pointer-events-none absolute left-8 top-10 h-44 w-44 rounded-full bg-violet-500/15 blur-3xl animate-float-slow" />
      <div className="pointer-events-none absolute bottom-8 right-10 h-52 w-52 rounded-full bg-cyan-400/10 blur-3xl animate-drift" />

      <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)] lg:items-center">
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-lg shadow-black/20">
                <svg
                  className="h-7 w-7 text-cyan-300"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 18h12" />
                  <path d="M9 6c0 3 6 3 6 6s-6 3-6 6" />
                  <path d="M12 4v2" />
                </svg>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.45em] text-cyan-200/70">Java Quest</p>
                <h1 className="mt-1 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Apprendre Java de zero, puis progresser jusqu'a la POO
                </h1>
              </div>
            </div>

            <p className="max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
              Ici, on commence vraiment par le cours: qu'est-ce que Java, comment compiler, puis les variables,
              les conditions, les boucles, les methodes, les tableaux et enfin la programmation orientee objet.
              Chaque chapitre se termine par un exercice ou un quiz simple.
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => selectChapter(0)}
                className="rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:scale-[1.02] hover:from-violet-400 hover:to-cyan-300"
              >
                Commencer le cours
              </button>
              <button
                type="button"
                onClick={handleRestart}
                className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10"
              >
                Repartir a zero
              </button>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/60 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Parcours</p>
                <h2 className="mt-1 text-lg font-semibold text-white">Base - POO</h2>
              </div>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                {completedIndices.length}/{chapters.length}
              </span>
            </div>

            <div className="mt-4 space-y-2">
              {chapters.map((chapter, index) => {
                const completed = completedIndices.includes(index);
                const active = index === currentIndex;
                const unlocked = index <= unlockedIndex;
                const label = statusLabel(index, currentIndex, unlockedIndex, completed);

                return (
                  <button
                    key={chapter.id}
                    type="button"
                    onClick={() => selectChapter(index)}
                    disabled={!unlocked}
                    className={`flex w-full items-center justify-between gap-4 rounded-2xl border px-4 py-3 text-left transition duration-200 ${
                      active
                        ? "border-cyan-300/40 bg-cyan-400/10"
                        : completed
                          ? "border-emerald-300/20 bg-emerald-400/8"
                          : unlocked
                            ? "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8"
                            : "cursor-not-allowed border-white/5 bg-white/[0.03] opacity-45"
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">Chapitre {index + 1}</p>
                      <p className="mt-1 truncate text-sm font-semibold text-white">{chapter.title}</p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                        completed
                          ? "bg-emerald-400/15 text-emerald-100"
                          : active
                            ? "bg-cyan-400/15 text-cyan-100"
                            : unlocked
                              ? "bg-white/10 text-slate-200"
                              : "bg-white/5 text-slate-500"
                      }`}
                    >
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 via-cyan-400 to-emerald-400 transition-[width] duration-500"
                style={{ width: `${totalProgress}%` }}
              />
            </div>
            <p className="mt-3 text-sm text-slate-400">Progression generale: {totalProgress}%</p>
          </div>
        </header>

        {allCompleted ? (
          <section className="mt-6 rounded-[1.75rem] border border-emerald-300/20 bg-emerald-500/10 p-5 text-emerald-50 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.35em] text-emerald-100/70">Bravo</p>
            <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">Tu as termine le parcours debutant</h2>
            <p className="mt-3 max-w-4xl text-sm leading-7 text-emerald-50/90 sm:text-base">
              Tu sais maintenant lire un programme Java simple, le compiler, manipuler des variables, ecrire des
              conditions, utiliser des boucles, creer des methodes, travailler avec des tableaux et comprendre les
              bases de la POO.
            </p>
          </section>
        ) : null}

        <main className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_340px]">
          <section className="space-y-6">
            <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/70">Cours</p>
              <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-white">{currentChapter.courseTitle}</h2>
                  <p className="mt-1 text-sm text-slate-400">{currentChapter.subtitle}</p>
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-300">
                  Chapitre {currentIndex + 1}
                </span>
              </div>

              <p className="mt-5 max-w-4xl text-base leading-7 text-slate-200">{currentChapter.overview}</p>

              <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.75fr)]">
                <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">A retenir</p>
                  <ul className="mt-3 space-y-3 text-sm leading-6 text-slate-200">
                    {currentChapter.lessons.map((lesson) => (
                      <li key={lesson} className="flex gap-3">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300" />
                        <span>{lesson}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-[1.4rem] border border-white/10 bg-slate-950/80 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Exemple</p>
                  <p className="mt-2 text-sm font-medium text-white">{currentChapter.exampleTitle}</p>
                  <pre className="mt-3 overflow-x-auto rounded-2xl border border-white/10 bg-black/40 p-4 font-mono text-[0.92rem] leading-7 text-slate-100">
                    {currentChapter.exampleCode.map((line, lineIndex) => (
                      <div key={`${currentChapter.id}-${lineIndex}`}>{line || " "}</div>
                    ))}
                  </pre>
                </div>
              </div>

              <div className="mt-5 rounded-[1.4rem] border border-white/10 bg-gradient-to-r from-violet-500/10 via-cyan-500/10 to-transparent p-4 text-sm leading-6 text-slate-200">
                {currentChapter.takeaway}
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/70">Exercice</p>
              <h3 className="mt-2 text-xl font-semibold text-white">Lis le cours, puis teste-toi</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{currentChapter.exercise.prompt}</p>

              {currentChapter.exercise.kind === "choice" ? (
                <div className="mt-5 grid gap-3">
                  {currentChapter.exercise.options.map((option) => {
                    const active = currentChoice === option;

                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleChoice(currentChapter.id, option)}
                        className={`rounded-2xl border px-4 py-3 text-left text-sm font-medium transition duration-200 ${
                          active
                            ? "border-cyan-300/40 bg-cyan-400/10 text-cyan-50"
                            : "border-white/10 bg-white/5 text-white hover:border-white/20 hover:bg-white/8"
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="mt-5 overflow-hidden rounded-[1.4rem] border border-white/10 bg-slate-950/80">
                  <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-xs uppercase tracking-[0.3em] text-slate-400">
                    <span>Code a completer</span>
                    <span>{currentCompleted ? "Valide" : "A completer"}</span>
                  </div>

                  <div className="space-y-1 px-4 py-4 font-mono text-[0.92rem] leading-8 text-slate-100">
                    {currentChapter.exercise.snippet.map((line, lineIndex) => renderCodeLine(line, lineIndex))}
                  </div>
                </div>
              )}

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={validateChapter}
                  className="rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:scale-[1.02] hover:from-violet-400 hover:to-cyan-300"
                >
                  Valider l'exercice
                </button>

                {currentCompleted && currentIndex < chapters.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="rounded-full border border-emerald-300/30 bg-emerald-400/10 px-5 py-3 text-sm font-semibold text-emerald-100 transition hover:border-emerald-200/50 hover:bg-emerald-400/15"
                  >
                    Chapitre suivant
                  </button>
                ) : null}

                <button
                  type="button"
                  onClick={handleRestart}
                  className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10"
                >
                  Recommencer
                </button>
              </div>

              <div
                className={`mt-5 rounded-[1.4rem] border p-4 text-sm leading-6 ${
                  feedback.kind === "success"
                    ? "border-emerald-300/20 bg-emerald-500/10 text-emerald-50"
                    : feedback.kind === "warning"
                      ? "border-amber-300/20 bg-amber-500/10 text-amber-50"
                      : feedback.kind === "error"
                        ? "border-rose-300/20 bg-rose-500/10 text-rose-50"
                        : "border-white/10 bg-white/5 text-slate-200"
                }`}
              >
                {feedback.text}
              </div>
            </div>
          </section>

          <aside className="rounded-[1.75rem] border border-white/10 bg-slate-950/60 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Raccourci</p>
                <h2 className="mt-1 text-lg font-semibold text-white">Navigation du cours</h2>
              </div>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                {completedIndices.length}/{chapters.length}
              </span>
            </div>

            <div className="mt-4 space-y-2">
              {chapters.map((chapter, index) => {
                const completed = completedIndices.includes(index);
                const active = index === currentIndex;
                const unlocked = index <= unlockedIndex;
                const label = statusLabel(index, currentIndex, unlockedIndex, completed);

                return (
                  <button
                    key={chapter.id}
                    type="button"
                    onClick={() => selectChapter(index)}
                    disabled={!unlocked}
                    className={`flex w-full items-center justify-between gap-4 rounded-2xl border px-4 py-3 text-left transition duration-200 ${
                      active
                        ? "border-cyan-300/40 bg-cyan-400/10"
                        : completed
                          ? "border-emerald-300/20 bg-emerald-400/8"
                          : unlocked
                            ? "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8"
                            : "cursor-not-allowed border-white/5 bg-white/[0.03] opacity-45"
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">Chapitre {index + 1}</p>
                      <p className="mt-1 truncate text-sm font-semibold text-white">{chapter.title}</p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                        completed
                          ? "bg-emerald-400/15 text-emerald-100"
                          : active
                            ? "bg-cyan-400/15 text-cyan-100"
                            : unlocked
                              ? "bg-white/10 text-slate-200"
                              : "bg-white/5 text-slate-500"
                      }`}
                    >
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Conseil</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Lis toujours le cours avant de cliquer sur valider. Le but est de comprendre, pas seulement de deviner.
              </p>
            </div>

            <div className="mt-4 rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Bilan</p>
              <div className="mt-3 space-y-3 text-sm text-slate-300">
                <div className="flex items-center justify-between gap-4">
                  <span>Chapitres valides</span>
                  <span className="font-medium text-white">{completedIndices.length}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>Prochain chapitre</span>
                  <span className="font-medium text-white">{Math.min(unlockedIndex + 1, chapters.length)}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>Etat actuel</span>
                  <span className="font-medium text-white">{currentCompleted ? "Revu" : "A travailler"}</span>
                </div>
              </div>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}