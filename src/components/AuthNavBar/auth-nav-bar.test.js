import React from "react";
import { render, cleanup } from "react-testing-library";
import { HashRouter as Router } from "react-router-dom";
import AuthNavBar from "./auth-nav-bar.component";
import * as Toaster from "../../utils/toaster";

describe.only("AuthNavBar", () => {
  afterAll(cleanup);

  const { container } = render(
    <Router>
      <AuthNavBar t={key => key} />
    </Router>
  );

  test("renders without crashing", () => {
    expect(container).toBeTruthy();
  });
});
