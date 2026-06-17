import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .utils_ai import call_openai_or_groq, run_local_patent_assessment, run_local_legal_assistant

class PatentCheckerAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        innovation_details = request.data.get('innovation_details', '')
        industry = request.data.get('industry', 'Software / General')
        existing_products = request.data.get('existing_products', '')
        patent_status = request.data.get('patent_status', 'Not Filed')

        if not innovation_details:
            return Response(
                {"error": "Innovation details are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Attempt API call
        system_instruction = (
            "You are an expert Intellectual Property Rights (IPR) Attorney specializing in global patent law. "
            "Analyze the user's innovation details, industry, existing products, and status. "
            "Respond ONLY with a valid JSON object matching this structure: \n"
            "{\n"
            "  \"patentability_score\": 75,\n"
            "  \"novelty_report\": \"Description of novelty findings...\",\n"
            "  \"inventive_step\": \"Description of inventive step factors...\",\n"
            "  \"industrial_applicability\": \"Description of utility factors...\",\n"
            "  \"potential_obstacles\": \"Description of possible blocks/prior art...\",\n"
            "  \"next_steps\": [\"Step 1\", \"Step 2\", \"Step 3\"]\n"
            "}"
        )
        prompt = (
            f"Innovation Details: {innovation_details}\n"
            f"Industry: {industry}\n"
            f"Existing Products: {existing_products}\n"
            f"Patent Status: {patent_status}"
        )

        ai_response = call_openai_or_groq(prompt, system_instruction)

        if ai_response:
            try:
                # Clean block code syntax in case LLM wraps response in ```json ```
                cleaned = ai_response.strip()
                if cleaned.startswith("```json"):
                    cleaned = cleaned[7:]
                if cleaned.endswith("```"):
                    cleaned = cleaned[:-3]
                cleaned = cleaned.strip()
                
                parsed_json = json.loads(cleaned)
                parsed_json['method'] = 'AI Engine (OpenAI/Groq)'
                return Response(parsed_json, status=status.HTTP_200_OK)
            except Exception:
                # If JSON parsing failed, fallback to local
                pass

        # Fallback to local Expert system
        report = run_local_patent_assessment(
            innovation_details, 
            industry, 
            existing_products, 
            patent_status
        )
        return Response(report, status=status.HTTP_200_OK)

class AiAssistantAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        message = request.data.get('message', '')
        if not message:
            return Response(
                {"error": "Message content is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        system_instruction = (
            "You are a professional, polite, and elite Legal AI Assistant for SR4IPR Partners, an IP law firm. "
            "Answer questions about patents, trademarks, copyrights, and design registrations. "
            "Responses must be concise, helpful, and written in plain language. "
            "End all responses with a standard legal disclaimer clarifying this is informational only."
        )

        ai_response = call_openai_or_groq(message, system_instruction)

        if ai_response:
            return Response({"response": ai_response, "method": "AI Engine"}, status=status.HTTP_200_OK)

        # Fallback to local expert NLP router
        reply = run_local_legal_assistant(message)
        return Response({"response": reply, "method": "Rule Engine"}, status=status.HTTP_200_OK)
