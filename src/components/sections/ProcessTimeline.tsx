import { PROCESS } from "@/content/site";
import { SectionWrapper } from "@/components/primitives/SectionWrapper";
import {
  StickyStorySection,
  type StoryStep,
} from "@/components/primitives/StickyStorySection";

export function ProcessTimeline() {
  const steps: StoryStep[] = PROCESS.map((step) => ({
    image: step.image,
    alt: step.alt,
    content: (
      <div className="max-w-md">
        <span className="font-display text-5xl font-black text-ember/30 sm:text-6xl">
          {step.num}
        </span>
        <h3 className="mt-2 text-2xl font-bold sm:text-3xl">{step.title}</h3>
        <p className="mt-3 text-base leading-relaxed text-forest/65 sm:text-lg">
          {step.text}
        </p>
      </div>
    ),
  }));

  return (
    <SectionWrapper
      id="process"
      tone="paper"
      kicker="איך זה עובד"
      title={"מהרחוב לגלריה —\nהמסע של כל חפץ"}
      intro="ששה שלבים שהופכים חפץ מושלך לפריט עיצוב עם סיפור והשפעה."
    >
      <StickyStorySection steps={steps} mediaSide="start" ratio="4/5" />
    </SectionWrapper>
  );
}
