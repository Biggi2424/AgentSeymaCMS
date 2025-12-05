import {
  ApiKey,
  CatalogItemType,
  CatalogRequestStatus,
  DeploymentResultStatus,
  DeploymentRolloutStrategy,
  DeploymentStatus,
  PackageType,
  PrismaClient,
  RebootBehavior,
  TicketPriority,
  TicketSource,
  TicketStatus,
  UserRole,
} from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { scryptSync } from "crypto";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required for seeding");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const ids = {
  tenant: {
    personal: "11111111-1111-1111-1111-111111111111",
    company: "22222222-2222-2222-2222-222222222222",
  },
  user: {
    personal: "11111111-1111-1111-1111-0000000000a1",
    companyAdmin: "22222222-2222-2222-2222-0000000000a1",
    companyAgent: "22222222-2222-2222-2222-0000000000a2",
  },
  agent: {
    personalLaptop: "11111111-1111-1111-2222-0000000000b1",
    companyLaptop: "22222222-2222-2222-3333-0000000000b1",
    companyEdge: "22222222-2222-2222-3333-0000000000b2",
  },
  deviceGroup: {
    design: "33333333-3333-3333-3333-0000000000c1",
    factory: "33333333-3333-3333-3333-0000000000c2",
  },
  package: {
    cad: "44444444-4444-4444-4444-0000000000d1",
    hardening: "44444444-4444-4444-4444-0000000000d2",
  },
  deployment: {
    cad: "55555555-5555-5555-5555-0000000000e1",
    hardening: "55555555-5555-5555-5555-0000000000e2",
  },
  ticket: {
    personalSupport: "66666666-6666-6666-6666-0000000000f1",
    vpn: "66666666-6666-6666-6666-0000000000f2",
    patch: "66666666-6666-6666-6666-0000000000f3",
    onboarding: "66666666-6666-6666-6666-0000000000f4",
  },
  catalogItem: {
    vpnAccess: "77777777-7777-7777-7777-777777777701",
    cadAddon: "77777777-7777-7777-7777-777777777702",
    healthCheck: "77777777-7777-7777-7777-777777777703",
  },
  catalogRequest: {
    vpnAccess: "88888888-8888-8888-8888-888888888801",
    cadAddon: "88888888-8888-8888-8888-888888888802",
    healthCheck: "88888888-8888-8888-8888-888888888803",
  },
  apiKey: {
    servicenow: "99999999-9999-9999-9999-999999999901",
    reporting: "99999999-9999-9999-9999-999999999902",
  },
};

const seedDates = {
  personalTenantCreated: new Date("2025-01-05T09:00:00Z"),
  companyTenantCreated: new Date("2024-12-15T08:00:00Z"),
  personalUserCreated: new Date("2025-01-05T09:15:00Z"),
  companyAdminCreated: new Date("2024-12-15T09:20:00Z"),
  companyAgentCreated: new Date("2024-12-20T10:00:00Z"),
};

function passwordHash(password: string, saltLabel: string) {
  const salt = Buffer.from(saltLabel).toString("hex").slice(0, 32);
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

async function resetDatabase() {
  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE portal.catalog_requests, portal.catalog_items, portal.deployment_results, portal.deployments, portal.device_group_members, portal.device_groups, portal.packages, portal.ticket_attachments, portal.ticket_comments, portal.tickets, portal.agent_events, portal.agents, portal.api_keys, portal.users RESTART IDENTITY CASCADE`
  );
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE core.users RESTART IDENTITY CASCADE`);
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE core.tenants RESTART IDENTITY CASCADE`);
}

async function seedTenants() {
  const personal = await prisma.tenant.create({
    data: {
      id: ids.tenant.personal,
      key: "aurora-personal",
      name: "Aurora Personal Workspace",
      slug: "aurora-personal",
      plan: "trial",
      createdAt: seedDates.personalTenantCreated,
    },
  });

  const company = await prisma.tenant.create({
    data: {
      id: ids.tenant.company,
      key: "helios-manufacturing",
      name: "Helios Manufacturing GmbH",
      slug: "helios-manufacturing",
      plan: "enterprise",
      createdAt: seedDates.companyTenantCreated,
    },
  });

  return { personal, company };
}

async function seedUsers() {
  const personalUser = await prisma.user.create({
    data: {
      id: ids.user.personal,
      tenantId: ids.tenant.personal,
      email: "user@personal.local",
      displayName: "Alex Meyer",
      role: UserRole.owner,
      authProvider: "local",
      passwordHash: passwordHash("ChangeMe!2025", "aurora-personal"),
      plan: "trial",
      trialExpiresAt: new Date("2025-02-15T00:00:00Z"),
      tokensQuotaPeriod: 50000,
      tokensUsedPeriod: 8200,
      throttleState: "normal",
      tenantType: "user",
      personaRole: "user",
      createdAt: seedDates.personalUserCreated,
    },
  });
  await prisma.coreUser.create({
    data: {
      id: ids.user.personal,
      tenantId: ids.tenant.personal,
      email: personalUser.email,
      displayName: personalUser.displayName,
      principalName: personalUser.email,
      createdAt: personalUser.createdAt,
    },
  });

  const companyAdmin = await prisma.user.create({
    data: {
      id: ids.user.companyAdmin,
      tenantId: ids.tenant.company,
      email: "admin@helios.local",
      displayName: "Sven Richter",
      role: UserRole.owner,
      authProvider: "local",
      passwordHash: passwordHash("AdminHelios#2025", "helios-admin"),
      plan: "enterprise",
      trialExpiresAt: null,
      tokensQuotaPeriod: 250000,
      tokensUsedPeriod: 120000,
      throttleState: "normal",
      tenantType: "company",
      personaRole: "company_admin",
      createdAt: seedDates.companyAdminCreated,
    },
  });
  await prisma.coreUser.create({
    data: {
      id: ids.user.companyAdmin,
      tenantId: ids.tenant.company,
      email: companyAdmin.email,
      displayName: companyAdmin.displayName,
      principalName: companyAdmin.email,
      createdAt: companyAdmin.createdAt,
    },
  });

  const companyAgent = await prisma.user.create({
    data: {
      id: ids.user.companyAgent,
      tenantId: ids.tenant.company,
      email: "agent@helios.local",
      displayName: "Lena Vogt",
      role: UserRole.operator,
      authProvider: "local",
      passwordHash: passwordHash("AgentHelios#2025", "helios-agent"),
      plan: "pro",
      trialExpiresAt: new Date("2025-03-01T00:00:00Z"),
      tokensQuotaPeriod: 150000,
      tokensUsedPeriod: 34000,
      throttleState: "normal",
      tenantType: "company",
      personaRole: "company_agent",
      createdAt: seedDates.companyAgentCreated,
    },
  });
  await prisma.coreUser.create({
    data: {
      id: ids.user.companyAgent,
      tenantId: ids.tenant.company,
      email: companyAgent.email,
      displayName: companyAgent.displayName,
      principalName: companyAgent.email,
      createdAt: companyAgent.createdAt,
    },
  });

  return { personalUser, companyAdmin, companyAgent };
}

async function seedAgents() {
  const personalLaptop = await prisma.agent.create({
    data: {
      id: ids.agent.personalLaptop,
      tenantId: ids.tenant.personal,
      userId: ids.user.personal,
      deviceName: "AURORA-LAPTOP",
      osVersion: "Windows 11 Pro 23H2",
      neyraqVersion: "1.6.4",
      onlineStatus: "online",
      lastSeenAt: new Date("2025-01-15T09:45:00Z"),
      tags: ["personal", "primary"],
      createdAt: new Date("2025-01-05T10:00:00Z"),
    },
  });

  const companyLaptop = await prisma.agent.create({
    data: {
      id: ids.agent.companyLaptop,
      tenantId: ids.tenant.company,
      userId: ids.user.companyAgent,
      deviceName: "HEL-CAD-051",
      osVersion: "Windows 11 Enterprise 23H2",
      neyraqVersion: "1.6.4",
      onlineStatus: "online",
      lastSeenAt: new Date("2025-01-15T08:20:00Z"),
      tags: ["cad", "design"],
      createdAt: new Date("2024-12-21T08:30:00Z"),
    },
  });

  const companyEdge = await prisma.agent.create({
    data: {
      id: ids.agent.companyEdge,
      tenantId: ids.tenant.company,
      userId: ids.user.companyAgent,
      deviceName: "HEL-EDGE-007",
      osVersion: "Windows 10 IoT 22H2",
      neyraqVersion: "1.6.2",
      onlineStatus: "offline",
      lastSeenAt: new Date("2025-01-14T17:45:00Z"),
      tags: ["factory", "line-a"],
      createdAt: new Date("2024-12-21T09:00:00Z"),
    },
  });

  await prisma.agentEvent.createMany({
    data: [
      {
        tenantId: ids.tenant.personal,
        agentId: personalLaptop.id,
        eventType: "heartbeat",
        severity: "info",
        message: "Agent check-in",
        payloadJson: { pingMs: 42 },
        createdAt: new Date("2025-01-15T09:45:00Z"),
      },
      {
        tenantId: ids.tenant.company,
        agentId: companyLaptop.id,
        eventType: "deployment",
        severity: "info",
        message: "CAD Suite ring 1 installed",
        payloadJson: { deploymentId: ids.deployment.cad, status: "success" },
        createdAt: new Date("2025-01-15T08:25:00Z"),
      },
      {
        tenantId: ids.tenant.company,
        agentId: companyEdge.id,
        eventType: "connectivity",
        severity: "warning",
        message: "Device offline > 12h",
        payloadJson: { lastSeenAt: "2025-01-14T17:45:00Z" },
        createdAt: new Date("2025-01-15T06:30:00Z"),
      },
    ],
  });

  return { personalLaptop, companyLaptop, companyEdge };
}

async function seedDeviceGroups(agents: { companyLaptop: string; companyEdge: string }) {
  const design = await prisma.deviceGroup.create({
    data: {
      id: ids.deviceGroup.design,
      tenantId: ids.tenant.company,
      name: "Design Laptops",
      description: "CAD and engineering notebooks",
      isDynamic: false,
      createdAt: new Date("2024-12-22T07:30:00Z"),
    },
  });

  const factory = await prisma.deviceGroup.create({
    data: {
      id: ids.deviceGroup.factory,
      tenantId: ids.tenant.company,
      name: "Factory Floor - Line A",
      description: "Industrial PCs on line A",
      isDynamic: false,
      createdAt: new Date("2024-12-22T07:45:00Z"),
    },
  });

  await prisma.deviceGroupMember.createMany({
    data: [
      { deviceGroupId: design.id, agentId: agents.companyLaptop },
      { deviceGroupId: factory.id, agentId: agents.companyEdge },
    ],
    skipDuplicates: true,
  });

  return { design, factory };
}

async function seedPackages() {
  const cad = await prisma.package.create({
    data: {
      id: ids.package.cad,
      tenantId: ids.tenant.company,
      name: "Helios CAD Suite",
      version: "2024.4",
      type: PackageType.msi,
      installCommand: "msiexec /i cad-suite-2024.4.msi /qn /norestart",
      uninstallCommand: "msiexec /x {CAD-2024-4} /qn /norestart",
      rebootBehavior: RebootBehavior.if_needed,
      fileUrl: "https://packages.helios.local/cad-suite-2024.4.msi",
      detectionRuleJson: {
        registry: "HKLM\\Software\\Helios\\CADSuite",
        version: "2024.4",
      },
      createdBy: ids.user.companyAdmin,
      createdAt: new Date("2024-12-22T09:00:00Z"),
      updatedAt: new Date("2025-01-12T10:00:00Z"),
    },
  });

  const hardening = await prisma.package.create({
    data: {
      id: ids.package.hardening,
      tenantId: ids.tenant.company,
      name: "Windows Hardening Baseline",
      version: "2025.01",
      type: PackageType.script,
      installCommand: "powershell -ExecutionPolicy Bypass -File harden.ps1",
      uninstallCommand: null,
      rebootBehavior: RebootBehavior.never,
      fileUrl: "https://packages.helios.local/baseline/harden.ps1",
      detectionRuleJson: { markerFile: "C:\\ProgramData\\Helios\\baseline-2025-01.txt" },
      createdBy: ids.user.companyAdmin,
      createdAt: new Date("2024-12-22T09:30:00Z"),
      updatedAt: new Date("2025-01-10T08:30:00Z"),
    },
  });

  return { cad, hardening };
}

async function seedDeployments(pkg: { cad: string; hardening: string }, groups: { design: string; factory: string }) {
  const cadDeployment = await prisma.deployment.create({
    data: {
      id: ids.deployment.cad,
      tenantId: ids.tenant.company,
      packageId: pkg.cad,
      deviceGroupId: groups.design,
      name: "CAD Suite Q1 rollout",
      rolloutStrategy: DeploymentRolloutStrategy.ring,
      ringConfigJson: { rings: [{ name: "Ring 1", percent: 25 }, { name: "Ring 2", percent: 50 }, { name: "Ring 3", percent: 25 }] },
      startTime: new Date("2025-01-15T07:00:00Z"),
      status: DeploymentStatus.running,
      createdBy: ids.user.companyAdmin,
      createdAt: new Date("2025-01-10T08:00:00Z"),
      updatedAt: new Date("2025-01-15T08:20:00Z"),
    },
  });

  const hardeningDeployment = await prisma.deployment.create({
    data: {
      id: ids.deployment.hardening,
      tenantId: ids.tenant.company,
      packageId: pkg.hardening,
      deviceGroupId: groups.factory,
      name: "Factory baseline refresh",
      rolloutStrategy: DeploymentRolloutStrategy.all_at_once,
      ringConfigJson: null,
      startTime: new Date("2025-01-18T06:00:00Z"),
      status: DeploymentStatus.pending,
      createdBy: ids.user.companyAdmin,
      createdAt: new Date("2025-01-10T08:15:00Z"),
      updatedAt: new Date("2025-01-12T07:00:00Z"),
    },
  });

  await prisma.deploymentResult.createMany({
    data: [
      {
        deploymentId: cadDeployment.id,
        tenantId: ids.tenant.company,
        agentId: ids.agent.companyLaptop,
        status: DeploymentResultStatus.success,
        lastUpdateAt: new Date("2025-01-15T08:25:00Z"),
        logUrl: "https://logs.helios.local/deployments/cad-hel-cad-051.log",
        lastMessage: "Installed successfully",
      },
      {
        deploymentId: cadDeployment.id,
        tenantId: ids.tenant.company,
        agentId: ids.agent.companyEdge,
        status: DeploymentResultStatus.pending,
        lastUpdateAt: new Date("2025-01-15T06:30:00Z"),
        logUrl: null,
        lastMessage: "Device offline, queued",
      },
      {
        deploymentId: hardeningDeployment.id,
        tenantId: ids.tenant.company,
        agentId: ids.agent.companyEdge,
        status: DeploymentResultStatus.pending,
        lastUpdateAt: new Date("2025-01-12T07:00:00Z"),
        logUrl: null,
        lastMessage: "Scheduled for maintenance window",
      },
    ],
  });

  return { cadDeployment, hardeningDeployment };
}

async function seedTickets() {
  const personalTicket = await prisma.ticket.create({
    data: {
      id: ids.ticket.personalSupport,
      tenantId: ids.tenant.personal,
      humanId: "PERS-1001",
      title: "Automated backup verification failed",
      description: "Backup job on AURORA-LAPTOP reported checksum mismatch. Needs review before next run.",
      status: TicketStatus.waiting,
      priority: TicketPriority.high,
      requesterUserId: ids.user.personal,
      assigneeUserId: null,
      source: TicketSource.portal,
      createdAt: new Date("2025-01-13T07:30:00Z"),
      updatedAt: new Date("2025-01-14T08:10:00Z"),
    },
  });

  const vpnTicket = await prisma.ticket.create({
    data: {
      id: ids.ticket.vpn,
      tenantId: ids.tenant.company,
      humanId: "NET-4521",
      title: "VPN disconnects after 20 minutes",
      description:
        "Production floor supervisors lose VPN connectivity after 20 minutes. Suspect idle timeout on gateway.",
      status: TicketStatus.in_progress,
      priority: TicketPriority.high,
      requesterUserId: ids.user.companyAgent,
      assigneeUserId: ids.user.companyAdmin,
      source: TicketSource.portal,
      createdAt: new Date("2025-01-12T06:30:00Z"),
      updatedAt: new Date("2025-01-15T09:00:00Z"),
    },
  });

  const patchTicket = await prisma.ticket.create({
    data: {
      id: ids.ticket.patch,
      tenantId: ids.tenant.company,
      humanId: "OPS-1310",
      title: "Patch wave validation",
      description:
        "Validate January hardening package on offline factory nodes before rollout. Align with maintenance window.",
      status: TicketStatus.waiting,
      priority: TicketPriority.normal,
      requesterUserId: ids.user.companyAdmin,
      assigneeUserId: ids.user.companyAgent,
      source: TicketSource.agent,
      createdAt: new Date("2025-01-14T11:00:00Z"),
      updatedAt: new Date("2025-01-15T08:00:00Z"),
    },
  });

  const onboardingTicket = await prisma.ticket.create({
    data: {
      id: ids.ticket.onboarding,
      tenantId: ids.tenant.company,
      humanId: "SRV-2044",
      title: "Onboard 3 new design laptops",
      description:
        "Procurement delivered 3 design laptops. Join to Helios tenant, deploy CAD suite, and register in Service Store.",
      status: TicketStatus.new,
      priority: TicketPriority.normal,
      requesterUserId: ids.user.companyAdmin,
      assigneeUserId: null,
      source: TicketSource.portal,
      createdAt: new Date("2025-01-15T07:15:00Z"),
      updatedAt: new Date("2025-01-15T07:15:00Z"),
    },
  });

  await prisma.ticketComment.createMany({
    data: [
      {
        tenantId: ids.tenant.company,
        ticketId: vpnTicket.id,
        authorUserId: ids.user.companyAdmin,
        agentId: null,
        body: "Extended VPN session timers on gateway. Need confirmation from floor devices.",
        isInternal: false,
        createdAt: new Date("2025-01-15T09:05:00Z"),
      },
      {
        tenantId: ids.tenant.company,
        ticketId: vpnTicket.id,
        authorUserId: ids.user.companyAgent,
        agentId: null,
        body: "Can confirm new config holds for 45 minutes on HEL-CAD-051. Monitoring overnight.",
        isInternal: false,
        createdAt: new Date("2025-01-15T11:00:00Z"),
      },
      {
        tenantId: ids.tenant.company,
        ticketId: patchTicket.id,
        authorUserId: ids.user.companyAdmin,
        agentId: null,
        body: "Schedule maintenance 18.01 06:00 CET to patch offline nodes.",
        isInternal: true,
        createdAt: new Date("2025-01-15T08:05:00Z"),
      },
    ],
  });

  await prisma.ticketAttachment.create({
    data: {
      tenantId: ids.tenant.company,
      ticketId: vpnTicket.id,
      fileName: "vpn-session-logs.zip",
      contentType: "application/zip",
      fileSizeBytes: BigInt(184320),
      storageUrl: "https://storage.helios.local/support/vpn-session-logs.zip",
      uploadedBy: ids.user.companyAgent,
      createdAt: new Date("2025-01-15T07:00:00Z"),
    },
  });

  return { personalTicket, vpnTicket, patchTicket, onboardingTicket };
}

async function seedCatalog(packages: { cad: string }) {
  const vpnItem = await prisma.catalogItem.create({
    data: {
      id: ids.catalogItem.vpnAccess,
      tenantId: ids.tenant.company,
      type: CatalogItemType.service,
      title: "VPN Remote Access",
      description: "Provision VPN profile with device certificate and split tunneling for factory floor.",
      category: "Connectivity",
      requiresApproval: true,
      linkedPackageId: null,
      linkedWorkflow: "vpn_profile_provisioning",
      isActive: true,
      createdAt: new Date("2025-01-10T09:00:00Z"),
      createdBy: ids.user.companyAdmin,
    },
  });

  const cadAddon = await prisma.catalogItem.create({
    data: {
      id: ids.catalogItem.cadAddon,
      tenantId: ids.tenant.company,
      type: CatalogItemType.software,
      title: "CAD Suite - Manufacturing Extensions",
      description: "Add-on libraries for CAM toolpaths and BOM export automation.",
      category: "Engineering",
      requiresApproval: false,
      linkedPackageId: packages.cad,
      linkedWorkflow: null,
      isActive: true,
      createdAt: new Date("2025-01-10T09:30:00Z"),
      createdBy: ids.user.companyAdmin,
    },
  });

  const healthCheck = await prisma.catalogItem.create({
    data: {
      id: ids.catalogItem.healthCheck,
      tenantId: ids.tenant.personal,
      type: CatalogItemType.service,
      title: "Laptop Health Check",
      description: "Battery, disk SMART, and update status review for personal workspace.",
      category: "Support",
      requiresApproval: false,
      linkedPackageId: null,
      linkedWorkflow: "health_check_personal",
      isActive: true,
      createdAt: new Date("2025-01-12T09:00:00Z"),
      createdBy: ids.user.personal,
    },
  });

  await prisma.catalogRequest.createMany({
    data: [
      {
        id: ids.catalogRequest.vpnAccess,
        tenantId: ids.tenant.company,
        catalogItemId: vpnItem.id,
        requesterUserId: ids.user.companyAgent,
        agentId: ids.agent.companyEdge,
        status: CatalogRequestStatus.in_review,
        createdAt: new Date("2025-01-12T10:00:00Z"),
        updatedAt: new Date("2025-01-15T07:30:00Z"),
        ticketId: ids.ticket.vpn,
        deploymentId: null,
      },
      {
        id: ids.catalogRequest.cadAddon,
        tenantId: ids.tenant.company,
        catalogItemId: cadAddon.id,
        requesterUserId: ids.user.companyAgent,
        agentId: ids.agent.companyLaptop,
        status: CatalogRequestStatus.approved,
        createdAt: new Date("2025-01-13T11:00:00Z"),
        updatedAt: new Date("2025-01-15T08:30:00Z"),
        ticketId: null,
        deploymentId: ids.deployment.cad,
      },
      {
        id: ids.catalogRequest.healthCheck,
        tenantId: ids.tenant.personal,
        catalogItemId: healthCheck.id,
        requesterUserId: ids.user.personal,
        agentId: ids.agent.personalLaptop,
        status: CatalogRequestStatus.fulfilled,
        createdAt: new Date("2025-01-14T07:00:00Z"),
        updatedAt: new Date("2025-01-14T09:00:00Z"),
        ticketId: ids.ticket.personalSupport,
        deploymentId: null,
      },
    ],
    skipDuplicates: true,
  });

  return { vpnItem, cadAddon, healthCheck };
}

async function seedApiKeys() {
  const apiKeys: ApiKey[] = [];

  apiKeys.push(
    await prisma.apiKey.create({
      data: {
        id: ids.apiKey.servicenow,
        tenantId: ids.tenant.company,
        label: "ServiceNow sync",
        secretHash: passwordHash("servicenow-bridge-2025", "helios-servicenow"),
        scopes: ["tickets:read", "tickets:write", "deployments:read"],
        createdBy: ids.user.companyAdmin,
        createdAt: new Date("2025-01-05T12:00:00Z"),
        lastUsedAt: new Date("2025-01-15T07:45:00Z"),
        isRevoked: false,
      },
    })
  );

  apiKeys.push(
    await prisma.apiKey.create({
      data: {
        id: ids.apiKey.reporting,
        tenantId: ids.tenant.personal,
        label: "PowerBI usage export",
        secretHash: passwordHash("pbi-export-2025", "aurora-reporting"),
        scopes: ["usage:read"],
        createdBy: ids.user.personal,
        createdAt: new Date("2025-01-10T11:00:00Z"),
        lastUsedAt: null,
        isRevoked: false,
      },
    })
  );

  return apiKeys;
}

async function main() {
  await resetDatabase();

  await seedTenants();
  const users = await seedUsers();
  const agents = await seedAgents();
  const groups = await seedDeviceGroups({ companyLaptop: agents.companyLaptop.id, companyEdge: agents.companyEdge.id });
  const pkgs = await seedPackages();
  await seedDeployments({ cad: pkgs.cad.id, hardening: pkgs.hardening.id }, { design: groups.design.id, factory: groups.factory.id });
  await seedTickets();
  await seedCatalog({ cad: pkgs.cad.id });
  await seedApiKeys();
}

main()
  .then(async () => {
    console.log("Seed completed with production-ready fixtures.");
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (error) => {
    console.error("Seed failed", error);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
