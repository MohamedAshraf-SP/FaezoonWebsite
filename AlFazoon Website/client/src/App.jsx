import "./index.css"; // This should include Tailwind CSS
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import WebFont from "webfontloader";
// import UserPage from "./pages/UserPage";
import { lazy, Suspense } from "react";
import Protect_Routes from "./ProtectedRoutes/Protect_Routes";
import ProtectUser from "./ProtectedRoutes/ProtectUser";
// import Dashboard from "./_Components/Dashboard";
import Overlay from "./_Components/Overlay";
import Header from "./pages/Header";

// load font
WebFont.load({
  google: {
    families: ["Yeseva One", "Poppins:wght@300;400;500;600;700"],
  },
});
// import components and make them load Lazy
const UserPage = lazy(() => import("./pages/UserPage"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const AllHaditgComp = lazy(() => import("./pages/Hadith"));
const aqidahsComp = lazy(() => import("./pages/Akida"));
const AzkarComp = lazy(() => import("./pages/Azkar"));
const DouaaComp = lazy(() => import("./pages/DouaaCategory"));
const DuaaCategory = lazy(() => import("./pages/DuaaCategoryDisplaying"));
const ArboonNawwaiComp = lazy(() => import("./pages/ArboonNawwai"));
const LoginPage = lazy(() => import("./pages/LoginPage"));

const NotFundPage = lazy(() => import("./pages/NotFind"));
const withSusspense = (Component) => (
  <Suspense fallback={<Overlay title={"Loading..."} />}>
    <Component />
  </Suspense>
);

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Header />,
    },
    // Start tutorial route
    {
      path: "Tutorials",
      children: [
        {
          path: "hadiths",
          element: withSusspense(AllHaditgComp),
        },
        {
          path: "aqidahs",
          element: withSusspense(aqidahsComp),
        },
        {
          path: "azkars",
          element: withSusspense(AzkarComp),
        },
        {
          path: "douas",
          element: withSusspense(DouaaComp),
        },
        {
          path: "douas/:categoryName",
          element: withSusspense(DuaaCategory),
        },
        {
          path: "arboonNawwis",
          element: withSusspense(ArboonNawwaiComp),
        },
      ],
    },
    // end tutorial route
    {
      path: "Dashboard",
      element: (
        <>
          <Protect_Routes>{withSusspense(Dashboard)}</Protect_Routes>
        </>
      ),
    },

    {
      path: "UserPage",
      element: (
        <>
          <ProtectUser>{withSusspense(UserPage)}</ProtectUser>
        </>
      ),
    },

    {
      path: "login",
      element: withSusspense(LoginPage),
    },
    {
      path: "not-found",
      element: withSusspense(NotFundPage),
    },
    {
      path: "*",
      element: withSusspense(NotFundPage),
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
