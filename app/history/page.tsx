import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

type HistoryItem = {
  id: string;
  language: "Python" | "JavaScript" | "C++" | "Java" | "TypeScript";
  title: string;
  datetime: string;
  tag: string;
  tagTone: "green" | "red" | "blue" | "yellow";
  code: string;
  summary: string;
  complexity: string;
  complexityNote: string;
  icon: string;
  accent: string;
  image: string;
};

const history: HistoryItem[] = [
  {
    id: "py-merge-sort",
    language: "Python",
    title: "Merge Sort Logic",
    datetime: "Oct 24, 2023 • 2:15 PM",
    tag: "Optimized",
    tagTone: "green",
    code: `def merge_sort(arr):
    if len(arr) > 1:
        mid = len(arr)//2
        L = arr[:mid]
        R = arr[mid:]
        merge_sort(L)
        merge_sort(R)`,
    summary:
      "The AI identified a recursive bottleneck and suggested in-place sorting for better memory efficiency.",
    complexity: "O(n log n)",
    complexityNote: "Time Complexity",
    icon: "psychology",
    accent: "blue",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDndwyi29E9DvkqawMrGR4NATnVRei63s7mX1Rz9x6PhkePY4PKVv3YSBpMctfNf81jtu-LufMRGZJi6LGH35LyAQaoOg0gSd-Bwwzg09RfrZ0esnsRtWsqgCU2pf9CzFWRMCSe8akDf7KdZL2RXjjuZLEOjcpdt86jAoicw_Qc43kILIG_XqyAerJmsgAfMxd3cbtVk3upwUZOF09mMe5TFC8hy0pVqqcsCWW20wglId3IMOPmk9DNb7wy1DjXdQ1YOLVQaDx8SdQ",
  },
  {
    id: "js-async-fetch",
    language: "JavaScript",
    title: "Async Fetch Bug",
    datetime: "Oct 23, 2023 • 11:40 AM",
    tag: "Bug Found",
    tagTone: "red",
    code: `async function getData() {
  const res = await fetch(url);
  const data = res.json();
  console.log(data);
  return data;
}`,
    summary: "Missing 'await' on res.json() call. The data variable returns a Promise instead of actual data.",
    complexity: "O(1)",
    complexityNote: "Network IO Heavy",
    icon: "bug_report",
    accent: "yellow",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBDJI8x6E4ViW8uNO857JjoAaYdVI9t3T--z8sT06NCsQ7PLNxq1ZZ7pqt5v7t6CFwy9eTtCELL5pouiaV0ZHmQRUOgn4L44YCMRZ8DUVNr4WmNDio9-kKWuow4ILKmnDeMpqZvKDLhgPiGIO7VzOdagbmxL6_SLLy0_4i0pYwS4tL8WEQwqhkjiAyy_TyT5kvouGOuaYhTGBJCm4ZCZudLhrqZxq8RwCvGHoaN09cSBXonWlakQnEIe5EQH-YcVpj5NMbOfoC_ZXE",
  },
  {
    id: "cpp-pointer",
    language: "C++",
    title: "Pointer Allocation",
    datetime: "Oct 21, 2023 • 09:12 AM",
    tag: "Refactor",
    tagTone: "blue",
    code: `int* ptr = new int[100];
for(int i=0; i<100; i++) {
    ptr[i] = i * 2;
}
// missing delete[]`,
    summary: "Identified a potential memory leak. Recommends using std::vector or smart pointers.",
    complexity: "O(n)",
    complexityNote: "Memory Leak Risk",
    icon: "memory",
    accent: "indigo",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBrq6xEJDYyBn9CSdYUjjrAzQsOo1_U_5DaEqwq1RrTuIkbt5IAja5j7UfaMGOO4PSebYVz30FQ5D7BytFBzZKpPx5dkYEhoW6YyIlYIMLgg-w7x2yl6rFCmy9r55oS2nXJ7Jje3Z0_3qTc2Qi8lqR5I3eIK_e2rP-BqZN_zQdZNzkoWpc9kVf1VCrHreGezIHScD-R61jfN3q3U9vGSkOREmj_KSOQkW_S-Zlwz5ucTQ9rTm3bIz7Qh7F3WGiJq-zQABxpi8UA2uM",
  },
  {
    id: "java-stream",
    language: "Java",
    title: "Stream API Filter",
    datetime: "Oct 20, 2023 • 4:30 PM",
    tag: "Good",
    tagTone: "green",
    code: `List<String> result = list.stream()
    .filter(s -> s.startsWith("A"))
    .collect(Collectors.toList());`,
    summary: "Correct usage of functional programming in Java. Clean and readable implementation.",
    complexity: "O(n)",
    complexityNote: "Standard Compliance",
    icon: "info",
    accent: "orange",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCffpax-Mai2thWCxqY-O9XNcbm7BsgAgEqhEsikRnDvz8LHix7_U_YAP7FHL-5R0Oj_DDOq_TUxp8l9CEQh0xvU7Xly7ooJFP4pwLPFzPZP65lZGLE1I6ljNUE9bfXOdtEOgM_DQ9_4W7zDG2_KBMj8gGqR7lB8yta8gRWOitC9_CxvswylqmJPSDu8qG0ExjN6_FXUPnpdQeUerNdnJ0kxetL52a5GbnHxIssbfdS6AzgBDHxeqY6Iw2JSXv8GQfPuj2VNRhwYXk",
  },
  {
    id: "py-nested-loop",
    language: "Python",
    title: "Nested Loop Analysis",
    datetime: "Oct 18, 2023 • 1:05 PM",
    tag: "Slow",
    tagTone: "yellow",
    code: `for i in range(len(data)):
    for j in range(len(data)):
        if data[i] == data[j] and i != j:
            return True`,
    summary: "Warning: Quadratic time complexity detected. Recommended using a HashSet for O(n) lookup.",
    complexity: "O(n²)",
    complexityNote: "High Complexity",
    icon: "speed",
    accent: "blue",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBJcB502JuBuh2nli4zAK2rWFdMv4gL-mFdcI4KGatSjzuBFcbY_wtOKyDtnQwGD6V93f3gSEcVNbxYGqzW0MrfLUckI8f01bmxFvd5h4MhwgnYD7zdbJboBmEwjHVtAfR8iug-0kAlkkFrrbktj4iiWdl0Nj2_D9PwPpmzAFsISIb7aH0KSprOo0iZ9fXsZKdt1ELZTLq7NOppX-XyLK7FAdEOqM_6QTqROtH0J1s8obApF7q68Q-T_oNKyT8uGo20wgzoMdshV0U",
  },
  {
    id: "ts-interface",
    language: "TypeScript",
    title: "Interface Definition",
    datetime: "Oct 15, 2023 • 6:45 PM",
    tag: "Solid",
    tagTone: "green",
    code: `interface User {
  id: string;
  name: string;
  email: string;
  roles: Role[];
}`,
    summary: "Excellent type safety. The interface structure follows domain-driven design principles.",
    complexity: "Typesafe",
    complexityNote: "Design Pattern",
    icon: "verified",
    accent: "blue",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBtcPFQoSpeMu10Vwgmp7KJ7qUlLJsBjOP-GZAoSiz6c_1qJkRmER6iVLkTTyRj8890UrXsT8Zzqkr7n7nA1gNygPerIvPGqNfScnhXhz_pF02LjVyriektQY0t_dBrXhfTHdhOgSmtr0wqMVUXPc-nBqFJD_aTpFnLckzwcbTJsU3ioS3NFLtcIT5056J9UsBWeuC14KHtSAcESN8FIF70QW8ByWn3uxZIwOKkGmksEaxGknO9MyhqEwaHeGLXqGHiZ8F2fhW9nck",
  },
];

const tagToneClasses: Record<HistoryItem["tagTone"], string> = {
  green: "bg-green-500/10 text-green-500",
  red: "bg-red-500/10 text-red-500",
  blue: "bg-blue-500/10 text-blue-500",
  yellow: "bg-yellow-500/10 text-yellow-600",
};

const accentBg: Record<string, string> = {
  blue: "bg-blue-500/10",
  yellow: "bg-yellow-500/10",
  indigo: "bg-indigo-500/10",
  orange: "bg-orange-500/10",
};

const HistoryCard = ({ item }: { item: HistoryItem }) => (
  <div className="group overflow-hidden rounded-xl border border-slate-200 bg-white transition-colors hover:border-primary/50 dark:border-slate-800 dark:bg-[#1a1d23]">
    <div className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${accentBg[item.accent]}`}>
            <img className="h-5 w-5" src={item.image} alt={item.language} />
          </div>
          <div>
            <h3 className="leading-none font-bold text-slate-900 dark:text-white">{item.title}</h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">{item.datetime}</span>
          </div>
        </div>
        <span className={`rounded px-2 py-1 text-[10px] font-bold uppercase ${tagToneClasses[item.tagTone]}`}>
          {item.tag}
        </span>
      </div>

      <div className="mb-4 rounded-lg border border-slate-100 bg-slate-50 p-4 dark:border-slate-800/50 dark:bg-slate-900/50">
        <pre className="code-snippet custom-scrollbar line-clamp-4 overflow-hidden text-xs text-slate-600 dark:text-slate-300">
          <code>{item.code}</code>
        </pre>
      </div>

      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <span className="material-icons mt-0.5 text-sm text-primary">{item.icon}</span>
          <p className="line-clamp-2 text-sm text-slate-600 dark:text-slate-300">{item.summary}</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="rounded bg-primary/10 px-2 py-0.5 text-primary">{item.complexity}</span>
          <span>{item.complexityNote}</span>
        </div>
      </div>
    </div>
    <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 transition-colors group-hover:bg-primary/5 dark:border-slate-800 dark:bg-white/5">
      <a href="#" className="flex items-center gap-1 text-sm font-semibold text-primary">
        View Full Analysis
        <span className="material-icons text-xs">arrow_forward</span>
      </a>
      <button className="text-slate-400 transition-colors hover:text-red-500">
        <span className="material-icons text-sm">delete_outline</span>
      </button>
    </div>
  </div>
);

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-background-light text-slate-900 dark:bg-background-dark dark:text-slate-100">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 pb-12 pt-24 sm:px-6 lg:px-8">
        {/* Action Bar */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Learning History</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Review your 24 previous code explanations and optimizations.</p>
          </div>
          <button className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90">
            <span className="material-icons text-sm">add</span>
            New Analysis
          </button>
        </div>

        {/* Search & Filters */}
        <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="relative lg:col-span-8">
            <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input
              type="text"
              placeholder="Search by language, keyword, or complexity..."
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-12 pr-4 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary dark:border-slate-800 dark:bg-[#1a1d23]"
            />
          </div>
          <div className="lg:col-span-2">
            <select className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition-all focus:ring-2 focus:ring-primary dark:border-slate-800 dark:bg-[#1a1d23]">
              <option>All Languages</option>
              <option>Python</option>
              <option>JavaScript</option>
              <option>C++</option>
              <option>Java</option>
            </select>
          </div>
          <div className="lg:col-span-2">
            <select className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition-all focus:ring-2 focus:ring-primary dark:border-slate-800 dark:bg-[#1a1d23]">
              <option>Most Recent</option>
              <option>Oldest First</option>
              <option>Complexity (High-Low)</option>
            </select>
          </div>
        </div>

        {/* History Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {history.map((item) => (
            <HistoryCard key={item.id} item={item} />
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 text-slate-500 dark:border-slate-800 dark:text-slate-400 md:flex-row">
          <span className="text-sm">Showing 6 of 24 analyses</span>
          <div className="flex gap-2">
            <button
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-50 disabled:opacity-50 dark:border-slate-800 dark:bg-[#1a1d23] dark:hover:bg-slate-800"
              disabled
            >
              Previous
            </button>
            <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white">1</button>
            <button className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-[#1a1d23] dark:hover:bg-slate-800">
              2
            </button>
            <button className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-[#1a1d23] dark:hover:bg-slate-800">
              3
            </button>
            <button className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-[#1a1d23] dark:hover:bg-slate-800">
              Next
            </button>
          </div>
        </div>
      </main>

      <div className="fixed bottom-8 right-8">
        <button className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-2xl transition-transform hover:scale-110">
          <span className="material-icons text-2xl">chat_bubble</span>
        </button>
      </div>
      <Footer />
    </div>
  );
}
