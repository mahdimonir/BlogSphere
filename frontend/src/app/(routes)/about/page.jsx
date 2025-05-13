"use client";

export default function About() {
  return (
    <div className="flex pt-5 bg-gray-50 dark:bg-gray-900 min-h-[calc(100vh-8rem)]">
      <div className="p-4 w-full">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            About Blog Sphere
          </h1>
          <p className="text-base text-gray-700 dark:text-gray-300 mb-4">
            Welcome to <span className="font-semibold">Blog Sphere</span>, a
            dynamic platform where creativity meets community. Our mission is to
            empower individuals to share their stories, ideas, and expertise
            through intuitive blogging tools and a vibrant social network.
          </p>
          <p className="text-base text-gray-700 dark:text-gray-300 mb-4">
            Whether you&apos;re a seasoned writer or just starting out, Blog
            Sphere offers a seamless experience with features like Markdown
            support for rich formatting, a robust content moderation system to
            ensure quality, and personalized user profiles to showcase your
            work.
          </p>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Our Features
          </h2>
          <ul className="list-disc list-inside text-base text-gray-700 dark:text-gray-300 mb-4">
            <li>Create and manage blog posts with Markdown.</li>
            <li>Engage with a community through comments and likes.</li>
            <li>Customize your profile to reflect your unique voice.</li>
            <li>Admin tools for content moderation and user management.</li>
          </ul>
          <p className="text-base text-gray-700 dark:text-gray-300">
            Join us today and become part of a growing community of
            storytellers. For questions or feedback, reach out at{" "}
            <a
              href="mailto:support@blogsphere.com"
              className="text-blue-500 hover:underline"
            >
              support@blogsphere.com
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
