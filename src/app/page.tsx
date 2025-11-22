import LandingPageUI from "./pageUI";
import { getLandingStats, getReviews } from "./actions";

export const revalidate = 60; // Cache na 60 sekund

export default async function Home() {
  const [stats, reviews] = await Promise.all([
    getLandingStats(),
    getReviews()
  ]);

  // Formatowanie recenzji (lub fallback, jeśli pusto)
  const formattedReviews = reviews?.length ? reviews.map((r: any) => ({
    name: r.profiles?.full_name || "Użytkownik",
    handle: "@" + r.profiles?.username,
    role: "Creator",
    text: r.content,
    avatar: r.profiles?.avatar_url || `https://api.dicebear.com/9.x/avataaars/svg?seed=${r.profiles?.username}`
  })) : [
    // Fallbackowe recenzje, jeśli baza pusta
    {
        name: "Alex Chen",
        handle: "@alexcodes",
        role: "Software Engineer",
        text: "VibeLink to absolutny gamechanger. Nareszcie moje portfolio wygląda tak, jak ja.",
        avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Alex"
    },
    {
        name: "Sarah Jenkins",
        handle: "@sarah_designs",
        role: "Digital Artist",
        text: "System motywów jest niesamowity. Jednym kliknięciem zmieniam cały klimat profilu.",
        avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Sarah"
    },
    {
        name: "Mike Ross",
        handle: "@mike_gaming",
        role: "Streamer",
        text: "Widget YouTube działa perfekcyjnie. Moi widzowie zawsze widzą najnowszy film.",
        avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Mike"
    }
  ];

  return <LandingPageUI stats={stats} reviews={formattedReviews} />;
}