import { supabase } from "./supabase/config.js";
import bcrypt from "bcrypt";

export const seedAdminUser = async () => {
  const email = "marcelgooodness144@gmail.com";
  const password = "Admin@123";

  // Check if admin user already exists
    const { data: existingUser, error: fetchError } = await supabase
    .from("Admins")
    .select("*")
    .eq("email", email)
    .single();
    if (fetchError && fetchError.code !== "PGRST116") {
        console.error("Error checking existing admin user:", fetchError);
        return;
    }

    if (existingUser) {
        console.log("Admin user already exists. Skipping seeding.");
        return;
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    // Insert new admin user
    const { data, error } = await supabase.from("Admins").insert([
        {
            email: email,
            password: hashedPassword,
            name: email.split("@")[0],
        },
    ]);
    if (error) {
        console.error("Error seeding admin user:", error);
    } else {
        console.log("Admin user seeded successfully:", data);
    }
};

// Run the seeding function
// seedAdminUser();