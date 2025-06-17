import { Request, Response } from "express";
import { sql } from "../../database/neon-config";
import {
  generateBusinessSlug,
  generateUniqueSlug,
} from "../../utils/slugUtils";

export const createBusiness = async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      phone,
      cnpj,
      address,
      cep,
      website,
      instagram,
      facebook,
      logo,
      banner,
    } = req.body;

    // Create business record
    const businessResult = await sql`
      INSERT INTO businesses (
        name, email, phone, cnpj, address, cep,
        website, instagram, facebook, logo_url, banner_url,
        created_at, updated_at
      )
      VALUES (
        ${name}, ${email}, ${phone}, ${cnpj || null}, ${address}, ${cep},
        ${website || null}, ${instagram || null}, ${facebook || null},
        ${logo || null}, ${banner || null},
        NOW(), NOW()
      )
      RETURNING *
    `;

    const business = businessResult[0];

    res.status(201).json({
      success: true,
      data: business,
      message: "Business created successfully",
    });
  } catch (error) {
    console.error("Error creating business:", error);
    res.status(500).json({
      success: false,
      message: "Error creating business",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const createServices = async (req: Request, res: Response) => {
  try {
    const { businessId, services } = req.body;

    if (!Array.isArray(services) || services.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Services array is required",
      });
    }

    // Create services in batch
    const servicePromises = services.map(async (service: any) => {
      return await sql`
        INSERT INTO services (
          name, description, duration, price, category,
          is_active, created_at, updated_at
        )
        VALUES (
          ${service.name}, ${service.description || null},
          ${service.duration}, ${service.price}, ${service.category},
          ${service.active !== false}, NOW(), NOW()
        )
        RETURNING *
      `;
    });

    const serviceResults = await Promise.all(servicePromises);
    const createdServices = serviceResults.map((result) => result[0]);

    res.status(201).json({
      success: true,
      data: createdServices,
      message: `${createdServices.length} services created successfully`,
    });
  } catch (error) {
    console.error("Error creating services:", error);
    res.status(500).json({
      success: false,
      message: "Error creating services",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const createProfessionals = async (req: Request, res: Response) => {
  try {
    const { businessId, professionals } = req.body;

    if (!Array.isArray(professionals) || professionals.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Professionals array is required",
      });
    }

    // Create professionals in batch
    const professionalPromises = professionals.map(
      async (professional: any) => {
        return await sql`
        INSERT INTO professionals (
          name, email, phone, role, type, photo_url,
          calendar_color, work_days, is_active, created_at, updated_at
        )
        VALUES (
          ${professional.name}, ${professional.email}, ${professional.phone},
          ${professional.role}, ${professional.type}, ${professional.photo || null},
          ${professional.calendarColor}, ${JSON.stringify(professional.workDays)},
          true, NOW(), NOW()
        )
        RETURNING *
      `;
      },
    );

    const professionalResults = await Promise.all(professionalPromises);
    const createdProfessionals = professionalResults.map((result) => result[0]);

    res.status(201).json({
      success: true,
      data: createdProfessionals,
      message: `${createdProfessionals.length} professionals created successfully`,
    });
  } catch (error) {
    console.error("Error creating professionals:", error);
    res.status(500).json({
      success: false,
      message: "Error creating professionals",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const createWorkingHours = async (req: Request, res: Response) => {
  try {
    const { businessId, workingHours } = req.body;

    if (!Array.isArray(workingHours) || workingHours.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Working hours array is required",
      });
    }

    // Create working hours in batch
    const hoursPromises = workingHours.map(async (hours: any) => {
      return await sql`
        INSERT INTO business_hours (
          day_of_week, is_open, open_time, close_time,
          lunch_break_start, lunch_break_end, created_at, updated_at
        )
        VALUES (
          ${hours.day}, ${hours.isOpen},
          ${hours.isOpen ? hours.openTime : null},
          ${hours.isOpen ? hours.closeTime : null},
          ${hours.lunchBreak?.start || null},
          ${hours.lunchBreak?.end || null},
          NOW(), NOW()
        )
        RETURNING *
      `;
    });

    const hoursResults = await Promise.all(hoursPromises);
    const createdHours = hoursResults.map((result) => result[0]);

    res.status(201).json({
      success: true,
      data: createdHours,
      message: "Working hours created successfully",
    });
  } catch (error) {
    console.error("Error creating working hours:", error);
    res.status(500).json({
      success: false,
      message: "Error creating working hours",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const completeOnboarding = async (req: Request, res: Response) => {
  try {
    const { businessInfo, services, professionals, workingHours } = req.body;

    // Start transaction-like approach by creating each component
    let businessResult, servicesResult, professionalsResult, hoursResult;

    // Create business
    businessResult = await sql`
      INSERT INTO businesses (
        name, email, phone, cnpj, address, cep,
        website, instagram, facebook, logo_url, banner_url,
        created_at, updated_at
      )
      VALUES (
        ${businessInfo.name}, ${businessInfo.email}, ${businessInfo.phone},
        ${businessInfo.cnpj || null}, ${businessInfo.address}, ${businessInfo.cep},
        ${businessInfo.website || null}, ${businessInfo.instagram || null},
        ${businessInfo.facebook || null}, ${businessInfo.logo || null},
        ${businessInfo.banner || null}, NOW(), NOW()
      )
      RETURNING *
    `;

    const business = businessResult[0];

    // Create services
    if (services && services.length > 0) {
      const servicePromises = services.map(async (service: any) => {
        return await sql`
          INSERT INTO services (
            name, description, duration, price, category,
            is_active, created_at, updated_at
          )
          VALUES (
            ${service.name}, ${service.description || null},
            ${service.duration}, ${service.price}, ${service.category},
            ${service.active !== false}, NOW(), NOW()
          )
          RETURNING *
        `;
      });
      const serviceResults = await Promise.all(servicePromises);
      servicesResult = serviceResults.map((result) => result[0]);
    }

    // Create professionals
    if (professionals && professionals.length > 0) {
      const professionalPromises = professionals.map(
        async (professional: any) => {
          return await sql`
          INSERT INTO professionals (
            name, email, phone, role, type, photo_url,
            calendar_color, work_days, is_active, created_at, updated_at
          )
          VALUES (
            ${professional.name}, ${professional.email}, ${professional.phone},
            ${professional.role}, ${professional.type}, ${professional.photo || null},
            ${professional.calendarColor}, ${JSON.stringify(professional.workDays)},
            true, NOW(), NOW()
          )
          RETURNING *
        `;
        },
      );
      const professionalResults = await Promise.all(professionalPromises);
      professionalsResult = professionalResults.map((result) => result[0]);
    }

    // Create working hours
    if (workingHours && workingHours.length > 0) {
      const hoursPromises = workingHours.map(async (hours: any) => {
        return await sql`
          INSERT INTO business_hours (
            day_of_week, is_open, open_time, close_time,
            lunch_break_start, lunch_break_end, created_at, updated_at
          )
          VALUES (
            ${hours.day}, ${hours.isOpen},
            ${hours.isOpen ? hours.openTime : null},
            ${hours.isOpen ? hours.closeTime : null},
            ${hours.lunchBreak?.start || null},
            ${hours.lunchBreak?.end || null},
            NOW(), NOW()
          )
          RETURNING *
        `;
      });
      const hoursResults = await Promise.all(hoursPromises);
      hoursResult = hoursResults.map((result) => result[0]);
    }

    res.status(201).json({
      success: true,
      data: {
        business,
        services: servicesResult || [],
        professionals: professionalsResult || [],
        workingHours: hoursResult || [],
      },
      message: "Onboarding completed successfully",
    });
  } catch (error) {
    console.error("Error completing onboarding:", error);
    res.status(500).json({
      success: false,
      message: "Error completing onboarding",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getOnboardingStatus = async (req: Request, res: Response) => {
  try {
    // Check if basic business setup exists
    const businessCount = await sql`
      SELECT COUNT(*) as count FROM businesses
    `;

    const servicesCount = await sql`
      SELECT COUNT(*) as count FROM services WHERE is_active = true
    `;

    const professionalsCount = await sql`
      SELECT COUNT(*) as count FROM professionals WHERE is_active = true
    `;

    const hoursCount = await sql`
      SELECT COUNT(*) as count FROM business_hours WHERE is_open = true
    `;

    const isCompleted =
      parseInt(businessCount[0].count) > 0 &&
      parseInt(servicesCount[0].count) > 0 &&
      parseInt(professionalsCount[0].count) > 0 &&
      parseInt(hoursCount[0].count) > 0;

    res.json({
      success: true,
      data: {
        isCompleted,
        stats: {
          businesses: parseInt(businessCount[0].count),
          services: parseInt(servicesCount[0].count),
          professionals: parseInt(professionalsCount[0].count),
          workingDays: parseInt(hoursCount[0].count),
        },
      },
    });
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    res.status(500).json({
      success: false,
      message: "Error checking onboarding status",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
