import LandingCard from "@/components/ui/landingCard";
import InstantPayment from "@/static/instantPayment.svg";
import Category from "@/static/category.svg";
import Graph from "@/static/graph.svg";
import Security from "@/static/security.svg";
import Fast from "@/static/fast.svg";
import FinancialInsights from "@/static/financial_insights.svg";

export default function LandingFeatures() {
  return (<div className="flex flex-col gap-20 items-center justify-center mt-32">
    <div className="flex flex-col justify-center items-center gap-4 text-white">
        <div className="text-7xl">Everything You Need to Create</div>
        <div className="2xl">Powerful features designed to make collaboration effortless and creativity limitless.</div>
    </div>
    <div className="grid grid-cols-3 gap-8">
      <LandingCard
        title={"Real-Time Collaboration"}
        description={
          "Work together seamlessly with your team. See cursors, edits, and changes in real-time as they happen."
        }
        image={<InstantPayment />}
      />
      <LandingCard
        title={"Intuitive Drawing Tools"}
        description={
          "Powerful yet simple tools for sketching, diagramming, and creating. From basic shapes to complex illustrations."
        }
        image={<Category />}
      />
      <LandingCard
        title={"Easy Sharing"}
        description={
          "Share your boards instantly with a link. Control permissions and collaborate with anyone, anywhere."
        }
        image={<Graph />}
      />
      <LandingCard
        title={"Works Everywhere"}
        description={
          "Access your boards from any device. Desktop, tablet, or mobile - your work follows you."
        }
        image={<Security />}
      />
      <LandingCard
        title={"Lightning Fast"}
        description={
          "Optimized for speed and performance. No lag, no delays - just smooth, responsive drawing experience."
        }
        image={<Fast />}
      />
      <LandingCard
        title={"Secure & Private"}
        description={
          "Your data is encrypted and secure. Private boards stay private, with enterprise-grade security."
        }
        image={<FinancialInsights />}
      />
    </div>
    </div>
  );
}
