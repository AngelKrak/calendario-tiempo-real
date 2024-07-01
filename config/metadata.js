const icons = {
	icon: "/assets/android-icon-512x512.png",
	shortcut: "/assets/android-icon-48x48.png",
	apple: "/assets/apple-icon.png",
	other: {
		rel: "apple-touch-icon-precomposed",
		url: "/assets/apple-icon-precomposed.png",
	},
};

const robots = {
	index: false,
	follow: true,
	nocache: false,
	googleBot: {
		index: false,
		follow: false,
		noimageindex: false,
		"max-video-preview": -1,
		"max-image-preview": "large",
		"max-snippet": -1,
	},
};

const openGraph = {
	images: [
		{
			url: "https://05b3136c-159d-4e66-88af-759cd988b233-00-3fhpjyct781nf.kirk.replit.dev/assets/screenshots/screen1.png",
			width: 1897,
			height: 872,
		},
	],
	locale: "es_MX",
	type: "website",
	icons: icons,
	robots: robots,
};

export const metadata = {
	title: "Calendario en tiempo real",
	description: "Creado con Next JS y Socket IO.",
	authors: ["Angel Ramirez"],
	metadataBase: new URL(
		"https://05b3136c-159d-4e66-88af-759cd988b233-00-3fhpjyct781nf.kirk.replit.dev",
	),
	alternates: {
		canonical: "/",
	},
	openGraph: openGraph,
};
