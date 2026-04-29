import { prisma } from "../config/prisma.js";
import { fail, ok } from "../utils/apiResponse.js";
import { verifyRefreshToken, generateTokens } from "../utils/jwt.js";

export async function refreshAccessToken(req, res) {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return fail(res, "Refresh token required", 400);
    }

    // Verify refresh token
    const payload = verifyRefreshToken(refreshToken);

    // Fetch user to ensure they still exist and are active
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: { id: true, email: true, role: true, isActive: true, fullName: true },
    });

    if (!user || !user.isActive) {
      return fail(res, "User not found or inactive", 401);
    }

    // Generate new tokens
    const tokens = generateTokens(user);

    return ok(
      res,
      {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user,
      },
      "Token refreshed successfully"
    );
  } catch (error) {
    return fail(res, error.message || "Token refresh failed", 401);
  }
}
