import Step from "shepherd.js/src/types/step";

export const builtInButtons = {
  cancel: {
    classes: "cancel-button",
    secondary: true,
    text: "Exit",
    type: "cancel",
  },
  next: {
    classes: "btn btn-success",
    text: "Next",
    type: "next",
  },
  back: {
    classes: "back-button",
    secondary: true,
    text: "Back",
    type: "back",
  },
  finish: {
    classes: "btn btn-primary",
    text: "Thank you!",
    type: "cancel",
  },
};

export const defaultStepOptions: Step.StepOptions = {
  classes: "shepherd-theme-arrows custom-default-class",
  scrollTo: { behavior: "smooth", block: "center" },
  cancelIcon: {
    enabled: true,
  },
  canClickTarget: false,
};

export const steps: Step.StepOptions[] = [
  {
    attachTo: {
      element: ".actions",
      on: "bottom",
    },
    popperOptions: {
      modifiers: [{ name: "offset", options: { offset: [0, 12] } }],
    },
    buttons: [builtInButtons.next],
    classes: "custom-class-name-1 custom-class-name-2",
    id: "intro",
    title: "Welcome Back !",
    text: ` This is Step 1`,
  },
  {
    attachTo: {
      element: ".get-started",
      on: "bottom",
    },
    popperOptions: {
      modifiers: [{ name: "offset", options: { offset: [0, 12] } }],
    },
    buttons: [builtInButtons.back, builtInButtons.next],
    classes: "custom-class-name-1 custom-class-name-2",
    id: "installation",
    title: "Register your account",
    text: "Get your Free SalonSpa account now.",
  },
  {
    attachTo: {
      element: ".contributors",
      on: "bottom",
    },
    popperOptions: {
      modifiers: [{ name: "offset", options: { offset: [0, 12] } }],
    },
    buttons: [builtInButtons.back, builtInButtons.next],
    classes: "custom-class-name-1 custom-class-name-2",
    id: "usage",
    title: "Login your account",
    text: "Sign in to continue to SalonSpa.",
  },
  {
    attachTo: {
      element: ".getProduct",
      on: "bottom",
    },
    popperOptions: {
      modifiers: [{ name: "offset", options: { offset: [0, 12] } }],
    },
    buttons: [builtInButtons.back, builtInButtons.next],
    classes: "custom-class-name-1 custom-class-name-2",
    id: "usage",
    title: "Login your account",
    text: "Sign in to continue to SalonSpa.",
  },
  {
    attachTo: {
      element: ".ThankYou",
      on: "bottom",
    },
    popperOptions: {
      modifiers: [{ name: "offset", options: { offset: [0, 12] } }],
    },
    buttons: [builtInButtons.back, builtInButtons.finish],
    classes: "custom-class-name-1 custom-class-name-2",
    id: "usage",
    title: "Thank you !",
    text: "Sign in to continue to SalonSpa.",
  },
];
