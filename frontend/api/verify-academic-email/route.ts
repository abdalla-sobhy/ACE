import { NextRequest, NextResponse } from 'next/server';
import {Verifier} from 'academic-email-verifier';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    const institutionName = await Verifier.getInstitutionName(email);
    const isAcademic = await Verifier.isAcademic(email);

    // Unified response for frontend usage
    return NextResponse.json({
      isAcademic,
      institutionName: institutionName || "",
      valid: !!institutionName && isAcademic,
      message: isAcademic
        ? (institutionName ? "Academic email verified." : "Academic email, but institution not found.")
        : "Not a valid academic email."
    });
  } catch (error) {
    return NextResponse.json({ valid: false, message: 'Server error.' }, { status: 500 });
  }
}
