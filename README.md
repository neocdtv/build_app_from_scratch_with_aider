# LLM Prompting Experiments

## About This Repository
This repository tests how prompts must be structured so that smaller local models (e.g., Qwen3.5-4B) can successfully generate the same Spring Boot applications as larger models (e.g., Qwen3.6-35B and Gemma-26B).

---

## Flow for Large Models (Qwen3.6-35B / Gemma-26B)
Larger parameter models are capable of comprehending the full context and generating the application in a single shot.

### Conceptual Workflow
1. **Gemini 3** generates `ARCHITECTURE_PROMPT.md`.
2. **Qwen3-Coder-Next** or **Qwen3.6-35B** generates `ARCHITECTURE.md` based on the prompt. *(Note: Qwen3-Coder-Next tends to generate a more modern architecture without DTOs or DAOs).*
3. **Gemini 3** generates `CODER_PROMPT.md`.
4. **Code Generation:** The model generates the app in one shot based on `CODER_PROMPT.md` (which references `ARCHITECTURE.md`).
   * **Qwen3.6-35B:** Generates a working app ~80% of the time (fails slightly more often than Gemma).
   * **Gemma-26B:** Generates a working app ~95% of the time.

### Aider Execution Steps
```text
/read-only ARCHITECTURE.md CODER_PROMPT.md
exec CODER_PROMPT.md
```

---

## Flow for Small Models (Qwen3.5-4B / Qwen3.5-9B)
Smaller models are not capable of handling all architectural and coding aspects in a single prompt. The workflow requires breaking the architecture and coder prompts into focused, sequential steps. *(Note: While 9B handles this easily, the primary focus is pushing the limits of the 4B model).*

### Conceptual Workflow
1. **Gemini 3** generates `ARCHITECTURE_PROMPT.md` (Same as above).
2. **Qwen / Gemma** generates `ARCHITECTURE.md` (Same as above).
3. **Gemini 3** generates `CODER_PROMPT.md` (Same as above).
4. **Gemini 3** generates multiple incremental steps (`ARCHITECT_CODER_PROMPT_MULTISTEP`) that mix the architecture and coder instructions together.
5. **Code Generation:** Executed incrementally per step.

### Aider Execution Steps

**Step 01: Setup and Model**
```text
/read-only ARCHITECT_CODER_PROMPT_MULTISTEP/01_setup_and_model.md
exec ARCHITECT_CODER_PROMPT_MULTISTEP/01_setup_and_model.md
```
* **Test:** Run `./run.sh` to compile and start the Spring Boot web app. *Expect this to fail (~90% of the time) due to a missing `mainClass`. This is expected, as the class is generated in Step 02.*
* **Cleanup:** 
  ```text
  /clear
  /drop ARCHITECT_CODER_PROMPT_MULTISTEP
  ```
  *(Clearing the chat history and dropping the directory keeps the context window small, forcing the model to concentrate solely on the current task).*

**Step 02: Repository and Seed**
```text
/read-only ARCHITECT_CODER_PROMPT_MULTISTEP/02_repository_and_seed.md
exec ARCHITECT_CODER_PROMPT_MULTISTEP/02_repository_and_seed.md
```
* **Test:** Run `./run.sh`. This step generates the `mainClass`, so the Spring Boot application should now start successfully.
* **Cleanup:** Run `/clear` and `/drop ARCHITECT_CODER_PROMPT_MULTISTEP`.

**Step 03: Service Layer**
```text
/read-only ARCHITECT_CODER_PROMPT_MULTISTEP/03_service_layer.md
exec ARCHITECT_CODER_PROMPT_MULTISTEP/03_service_layer.md
```
* **Test:** Run `./run.sh`.
* **Cleanup:** Run `/clear` and `/drop ARCHITECT_CODER_PROMPT_MULTISTEP`.

**Step 04: API Controller**
```text
/read-only ARCHITECT_CODER_PROMPT_MULTISTEP/04_api_controller.md
exec ARCHITECT_CODER_PROMPT_MULTISTEP/04_api_controller.md
```
* **Test:** Run `./run.sh`.
* **Cleanup:** Run `/clear` and `/drop ARCHITECT_CODER_PROMPT_MULTISTEP`.

**Step 05: Frontend UI**
```text
/read-only ARCHITECT_CODER_PROMPT_MULTISTEP/05_frontend_ui.md
exec ARCHITECT_CODER_PROMPT_MULTISTEP/05_frontend_ui.md
```
* **Test:** Run `./run.sh`.
* **Cleanup:** Run `/clear` and `/drop ARCHITECT_CODER_PROMPT_MULTISTEP`.
