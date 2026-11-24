export type VideoItem = {
  id: number;
  title: string;
  video: string;
  /** Cloudinary asset id. Present only for videos uploaded through the admin. */
  publicId?: string;
};
export type WorkVideo = VideoItem & { frameTime?: number; thumbnail?: string };
export type WorkCategory = { label: string; key: string; videos: WorkVideo[] };
export type PricingPlan = {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular: boolean;
  buttonText: string;
};

export type SiteContent = {
  brandName: string;
  navCtaText: string;
  hero: {
    line1: string;
    line2: string;
    accent: string;
    description: string;
    imageUrl: string;
    imageX: number;
    imageY: number;
    imageZoom: number;
    imageBrightness: number;
    primaryButtonText: string;
    secondaryButtonText: string;
  };
  showcase: {
    eyebrow: string;
    title: string;
    accent: string;
    videos: VideoItem[];
  };
  workCategories: WorkCategory[];
  pricing: {
    eyebrow: string;
    title: string;
    accent: string;
    plans: PricingPlan[];
  };
};

export const defaultContent: SiteContent = {
  brandName: "HassanEditz",
  navCtaText: "Let's Talk",
  hero: {
    line1: "Turning Raw",
    line2: "Footage Into",
    accent: "Cinematic Stories",
    description:
      "Professional video editing for creators, brands, and businesses. We craft visuals that captivate and convert.",
    imageUrl:
      "https://raw.githubusercontent.com/hamza4557/Portfolio_assets/main/hassan.jpeg",
    imageX: 50,
    imageY: 12,
    imageZoom: 110,
    imageBrightness: 100,
    primaryButtonText: "View My Work",
    secondaryButtonText: "Start a Project",
  },
  showcase: {
    eyebrow: "Featured Work",
    title: "Cinematic",
    accent: "Showcase",
    videos: [
      {
        id: 1,
        title: "DOCUMENTARY",
        video:
          "https://res.cloudinary.com/dpo5geezr/video/upload/q_auto/f_auto/v1777299917/Documentaries_3_tlh6qr.mp4",
      },
      {
        id: 2,
        title: "MOTION GRAPHICS",
        video:
          "https://res.cloudinary.com/dpo5geezr/video/upload/q_auto/f_auto/v1777300274/MotionGrpahics_1_hakvxl.mp4",
      },
      {
        id: 3,
        title: "SAAS EXPLAINER",
        video:
          "https://res.cloudinary.com/dpo5geezr/video/upload/q_auto/f_auto/v1777300506/1_e1fgqk.mp4",
      },
      {
        id: 4,
        title: "SHORT FORM",
        video:
          "https://res.cloudinary.com/dpo5geezr/video/upload/q_auto/f_auto/v1777299370/1_mtkdiu.mp4",
      },
      {
        id: 5,
        title: "TUTORIALS",
        video:
          "https://res.cloudinary.com/dpo5geezr/video/upload/q_auto/f_auto/v1777300196/3_wk8qj9.mp4",
      },
      {
        id: 6,
        title: "YOUTUBE CONTENT",
        video:
          "https://res.cloudinary.com/dpo5geezr/video/upload/q_auto/f_auto/v1777299233/2_seu4rv.mp4",
      },
    ],
  },
  workCategories: [
    {
      label: "DOCUMENTARY",
      key: "documentary",
      videos: [
        {
          id: 1,
          title: "Documentary 1",
          video:
            "https://res.cloudinary.com/dpo5geezr/video/upload/q_auto/f_auto/v1777300547/Documentaries_2_xpo8mn.mp4",
          frameTime: 7,
        },
        {
          id: 2,
          title: "Documentary 2",
          video:
            "https://res.cloudinary.com/dpo5geezr/video/upload/q_auto/f_auto/v1777300088/Documentaries_1_ntj9xe.mp4",
          frameTime: 7,
        },
        {
          id: 3,
          title: "Documentary 3",
          video:
            "https://res.cloudinary.com/dpo5geezr/video/upload/q_auto/f_auto/v1777299917/Documentaries_3_tlh6qr.mp4",
          frameTime: 8,
        },
      ],
    },
    {
      label: "Motion Graphics",
      key: "motiongraphics",
      videos: [
        {
          id: 4,
          title: "Motion Graphics 1",
          video:
            "https://res.cloudinary.com/dpo5geezr/video/upload/q_auto/f_auto/v1777300274/MotionGrpahics_1_hakvxl.mp4",
          frameTime: 3,
        },
        {
          id: 5,
          title: "Motion Graphics 2",
          video:
            "https://res.cloudinary.com/dpo5geezr/video/upload/q_auto/f_auto/v1777299772/MotionGrpahics_3_txocng.mp4",
          frameTime: 1,
        },
        {
          id: 6,
          title: "Motion Graphics 3",
          video:
            "https://res.cloudinary.com/dpo5geezr/video/upload/q_auto/f_auto/v1777299712/MotionGrpahics_2_p8wgxz.mp4",
          frameTime: 4.6,
        },
      ],
    },
    {
      label: "SHORT FORM",
      key: "shortform",
      videos: [
        {
          id: 8,
          title: "Short 1",
          video:
            "https://res.cloudinary.com/dpo5geezr/video/upload/q_auto/f_auto/v1777299461/3_hqkiai.mp4",
          frameTime: 5.4,
        },
        {
          id: 9,
          title: "Short 2",
          video:
            "https://res.cloudinary.com/dpo5geezr/video/upload/q_auto/f_auto/v1777299378/2_ujveri.mp4",
          frameTime: 2,
        },
        {
          id: 10,
          title: "Short 3",
          video:
            "https://res.cloudinary.com/dpo5geezr/video/upload/q_auto/f_auto/v1777299370/1_mtkdiu.mp4",
          frameTime: 4,
        },
      ],
    },
    {
      label: "TUTORIALS",
      key: "tutorials",
      videos: [
        {
          id: 11,
          title: "Tutorial 1",
          video:
            "https://res.cloudinary.com/dpo5geezr/video/upload/q_auto/f_auto/v1777300512/2_zipucm.mp4",
          frameTime: 34,
        },
        {
          id: 12,
          title: "Tutorial 2",
          video:
            "https://res.cloudinary.com/dpo5geezr/video/upload/q_auto/f_auto/v1777300427/1_bt2wy0.mp4",
          frameTime: 4,
        },
        {
          id: 13,
          title: "Tutorial 3",
          video:
            "https://res.cloudinary.com/dpo5geezr/video/upload/q_auto/f_auto/v1777300196/3_wk8qj9.mp4",
          frameTime: 1,
        },
      ],
    },
    {
      label: "YOUTUBE CONTENT",
      key: "youtube",
      videos: [
        {
          id: 14,
          title: "YouTube 1",
          video:
            "https://res.cloudinary.com/dpo5geezr/video/upload/q_auto/f_auto/v1777300584/1_d15zzs.mp4",
          frameTime: 3,
        },
        {
          id: 15,
          title: "YouTube 2",
          video:
            "https://res.cloudinary.com/dpo5geezr/video/upload/q_auto/f_auto/v1777300462/3_aecqol.mp4",
          frameTime: 2,
        },
        {
          id: 16,
          title: "YouTube 3",
          video:
            "https://res.cloudinary.com/dpo5geezr/video/upload/q_auto/f_auto/v1777299233/2_seu4rv.mp4",
          frameTime: 6.5,
        },
      ],
    },
    {
      label: "SAAS EXPLAINER",
      key: "saas",
      videos: [
        {
          id: 17,
          title: "SAAS Explainer 1",
          video:
            "https://res.cloudinary.com/dpo5geezr/video/upload/q_auto/f_auto/v1777300506/1_e1fgqk.mp4",
          frameTime: 1,
        },
      ],
    },
  ],
  pricing: {
    eyebrow: "Investment",
    title: "Transparent",
    accent: "Pricing",
    plans: [
      {
        name: "Starter",
        price: "$149",
        period: "/video",
        description:
          "Perfect for short-form content and simple YouTube videos.",
        features: [
          "Basic color correction",
          "Standard audio mixing",
          "Simple text animation",
          "2 revisions",
          "Short clips support",
        ],
        popular: false,
        buttonText: "Start Starter",
      },
      {
        name: "Professional",
        price: "$299",
        period: "/video",
        description:
          "Ideal for professional YouTube channels and brand promos.",
        features: [
          "Up to 15 minutes final length",
          "Advanced color grading",
          "Premium sound design",
          "Custom motion graphics",
          "2 rounds of revisions",
          "Priority delivery",
        ],
        popular: false,
        buttonText: "Start Professional",
      },
      {
        name: "Signature",
        price: "$499",
        period: "/video",
        description:
          "For cinematic commercials and premium storytelling projects.",
        features: [
          "Unlimited final length",
          "Cinematic grading",
          "Full audio mastering",
          "Advanced motion graphics",
          "Unlimited revisions",
          "Priority 7-day delivery",
          "Source files included",
        ],
        popular: true,
        buttonText: "Start Signature",
      },
    ],
  },
};
