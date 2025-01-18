"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Decimal from "decimal.js";
import { m } from "motion/react";
import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import v from "validator";
import { z } from "zod";

import { MFormItem } from "@/components/motion";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const variants = {
  hidden: { opacity: 0, scale: 0.8, filter: "blur(10px)" },
  visible: { opacity: 1, scale: 1, filter: "blur(0px)" },
};

const decimal = z
  .string()
  .refine((value) => !v.isEmpty(value), "Must not be empty.")
  .transform((value) => value.replaceAll(",", "."))
  .refine(v.isFloat, "Must be a number.")
  .transform((value) => new Decimal(value));

const schema = z.object({
  distance: decimal,
  fuelConsumption: decimal,
  fuelPrice: decimal,
});

export default function Home() {
  const form = useForm<
    z.input<typeof schema>,
    unknown,
    z.output<typeof schema>
  >({
    resolver: zodResolver(schema),
    shouldFocusError: false,
    defaultValues: {
      distance: "",
      fuelConsumption: "",
      fuelPrice: "",
    },
    mode: "onChange",
  });

  const [result, setResult] = useState<Decimal>();

  const handleSubmit = useCallback(
    ({ distance, fuelConsumption, fuelPrice }: z.output<typeof schema>) => {
      setResult(
        fuelConsumption.times(fuelPrice).times(distance.div(new Decimal(100))),
      );
    },
    [],
  );

  useEffect(() => {
    const subscription = form.watch(() =>
      form.handleSubmit(handleSubmit, () => setResult(undefined))(),
    );

    return () => subscription.unsubscribe();
  }, [form, handleSubmit]);

  return (
    <m.main
      className="mx-auto flex min-h-screen max-w-xl flex-col justify-center gap-8 p-4"
      initial="hidden"
      animate="visible"
      transition={{ staggerChildren: 0.1 }}
    >
      <m.h1 variants={variants} className="text-center text-2xl font-bold">
        Fuel price calculator
      </m.h1>

      <Form {...form}>
        <form className="flex w-full flex-col gap-4">
          <FormField
            control={form.control}
            name="distance"
            render={({ field, fieldState }) => (
              <MFormItem variants={variants}>
                <FormLabel
                  className={fieldState.isTouched ? undefined : "text-black"}
                >
                  Distance (km)
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                {fieldState.isTouched && <FormMessage />}
              </MFormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fuelConsumption"
            render={({ field, fieldState }) => (
              <MFormItem variants={variants}>
                <FormLabel
                  className={fieldState.isTouched ? undefined : "text-black"}
                >
                  Fuel consumption (l/100 km)
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                {fieldState.isTouched && <FormMessage />}
              </MFormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fuelPrice"
            render={({ field, fieldState }) => (
              <MFormItem variants={variants}>
                <FormLabel
                  className={fieldState.isTouched ? undefined : "text-black"}
                >
                  Fuel price (zł/l)
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                {fieldState.isTouched && <FormMessage />}
              </MFormItem>
            )}
          />

          <MFormItem variants={variants}>
            <FormLabel>Travel price</FormLabel>
            <Input
              value={
                result ? result.toFixed(2) : "Fill the form to see the result"
              }
              disabled
            />
          </MFormItem>
        </form>
      </Form>
    </m.main>
  );
}
