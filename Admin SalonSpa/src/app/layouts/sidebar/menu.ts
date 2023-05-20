import { GlobalComponent, RoleSpa } from "src/app/app.constant";
import { MenuItem } from "./menu.model";
import { User } from "src/app/core/models/auth.models";

export function checkRole(): MenuItem[] {
  const checkRole: User = JSON.parse(
    localStorage.getItem(GlobalComponent.CUSTOMER_KEY)!
  );

  function checkRoleAdmin(): boolean {
    return checkRole?.role === RoleSpa.ROLE_ADMIN;
  }

  function checkRoleEmployee(): boolean {
    return checkRole?.role === RoleSpa.ROLE_EMPLOYEE;
  }

  function checkRoleManager(): boolean {
    return checkRole?.role === RoleSpa.ROLE_MANAGER;
  }

  return [
    {
      id: 1,
      label: "MENUITEMS.MENU.TEXT",
      isTitle: true,
      checkRole: true,
    },
    {
      id: 2,
      label: "MENUITEMS.DASHBOARD.TEXT",
      icon: "ri-dashboard-fill",
      link: "/projects",
      checkRole: checkRoleAdmin(),
    },
    {
      id: 3,
      label: "MENUITEMS.APPS.LIST.CHAT",
      link: "/chat",
      icon: "ri-question-answer-line",
      checkRole: checkRoleAdmin(),
    },
    {
      id: 4,
      label: "MENUITEMS.APPS.LIST.CONTACT",
      icon: "ri-file-user-line",
      link: "/entities/contacts",
      checkRole: checkRoleAdmin(),
    },
    {
      id: 5,
      label: "MENUITEMS.APPS.LIST.EMPLOYEE",
      icon: "ri-file-user-fill",
      link: "/entities/employees",
      checkRole: checkRoleAdmin() || checkRoleManager(),
    },
    {
      id: 6,
      label: "MENUITEMS.APPS.LIST.MANAGER",
      icon: "ri-file-shield-line",
      link: "/entities/managers",
      checkRole: checkRoleAdmin(),
    },
    {
      id: 16,
      label: "MENUITEMS.APPS.LIST.MARKET",
      icon: "ri-shopping-cart-2-fill",
      parentId: 12,
      link: "/ecommerce/market",
      checkRole: true,
    },
    {
      id: 13,
      label: "MENUITEMS.APPS.LIST.BOOKING",
      icon: " bx bxl-shopify",
      link: "/ecommerce/booking",
      parentId: 12,
      checkRole: true,
    },
    {
      id: 14,
      label: "MENUITEMS.APPS.LIST.BILL",
      icon: "ri-file-list-3-fill",
      link: "/ecommerce/bill-admin",
      checkRole: checkRoleAdmin(),
      parentId: 12,
    },
    {
      id: 15,
      label: "MENUITEMS.APPS.LIST.BILL",
      icon: "ri-file-list-3-fill",
      link: "/ecommerce/bill-employee",
      checkRole: !checkRoleAdmin(),
      parentId: 12,
    },
    {
      id: 7,
      label: "MENUITEMS.APPS.LIST.ENTITIES",
      icon: "ri-dashboard-2-line",
      checkRole: checkRoleAdmin(),
      subItems: [
        {
          id: 11,
          label: "MENUITEMS.APPS.LIST.SERVICES",
          link: "entities/services",
          parentId: 7,
          checkRole: true,
        },
        {
          id: 8,
          label: "MENUITEMS.APPS.LIST.BRANCHES",
          link: "/entities/branches",
          parentId: 7,
          checkRole: true,
        },
        {
          id: 9,
          label: "MENUITEMS.APPS.LIST.NOTIFICATIONS",
          link: "entities/notifications",
          parentId: 7,
          checkRole: true,
        },
        {
          id: 10,
          label: "MENUITEMS.APPS.LIST.POSTS",
          link: "entities/posts",
          parentId: 7,
          checkRole: true,
        },
      ],
    },
    {
      id: 17,
      label: "MENUITEMS.APPS.LIST.LANDING",
      icon: "ri-rocket-line",
      link: "/landing/booking",
      checkRole: true,
    },
  ];
}
