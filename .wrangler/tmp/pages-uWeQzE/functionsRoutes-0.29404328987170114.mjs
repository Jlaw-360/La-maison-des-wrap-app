import { onRequest as __api_auth___catchall___js_onRequest } from "C:\\Users\\Walke\\Videos\\La maison des wraps app\\functions\\api\\auth\\[[catchall]].js"
import { onRequestOptions as __api_calculate_distance_js_onRequestOptions } from "C:\\Users\\Walke\\Videos\\La maison des wraps app\\functions\\api\\calculate-distance.js"
import { onRequestPost as __api_calculate_distance_js_onRequestPost } from "C:\\Users\\Walke\\Videos\\La maison des wraps app\\functions\\api\\calculate-distance.js"
import { onRequestOptions as __api_create_payment_intent_js_onRequestOptions } from "C:\\Users\\Walke\\Videos\\La maison des wraps app\\functions\\api\\create-payment-intent.js"
import { onRequestPost as __api_create_payment_intent_js_onRequestPost } from "C:\\Users\\Walke\\Videos\\La maison des wraps app\\functions\\api\\create-payment-intent.js"

export const routes = [
    {
      routePath: "/api/auth/:catchall*",
      mountPath: "/api/auth",
      method: "",
      middlewares: [],
      modules: [__api_auth___catchall___js_onRequest],
    },
  {
      routePath: "/api/calculate-distance",
      mountPath: "/api",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_calculate_distance_js_onRequestOptions],
    },
  {
      routePath: "/api/calculate-distance",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_calculate_distance_js_onRequestPost],
    },
  {
      routePath: "/api/create-payment-intent",
      mountPath: "/api",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_create_payment_intent_js_onRequestOptions],
    },
  {
      routePath: "/api/create-payment-intent",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_create_payment_intent_js_onRequestPost],
    },
  ]