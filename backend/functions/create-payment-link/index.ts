// Edge function template (Deno)
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
serve(async (req) => {
  return new Response(JSON.stringify({ message: 'create-payment-link placeholder' }), { status: 200 });
});
