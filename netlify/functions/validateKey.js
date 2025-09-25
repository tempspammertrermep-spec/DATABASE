const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

exports.handler = async (event) => {
  try {
    const { key } = JSON.parse(event.body);
    const userIp = event.headers["x-nf-client-connection-ip"] || "unknown";
    console.log("User IP:", userIp);

    const { data: keyData, error } = await supabase
      .from("keys")
      .select("*")
      .eq("key", key)
      .single();

    if (error || !keyData) {
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ valid: false, message: "Invalid key" })
      };
    }

    if (!keyData.ip) {
      const { error: updateError } = await supabase
        .from("keys")
        .update({ ip: userIp })
        .eq("key", key);

      if (updateError) {
        return {
          statusCode: 200,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ valid: false, message: "Server error binding IP" })
        };
      }
      keyData.ip = userIp;
    }

    if (keyData.ip !== userIp) {
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ valid: false, message: "This key is bound to another IP" })
      };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ valid: true, message: "Key valid" })
    };

  } catch (err) {
    console.error("Function error:", err);
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ valid: false, message: `Server error: ${err.message}` })
    };
  }
};