Architect-Model: qwen3.6-35B-UD-Q4_K_XL
Editor-Model: qwen3.6-35B-UD-Q4_K_XL

/bin/llama-server \
-m ../../models/Qwen3.6/MTP/Qwen3.6-35B-A3B-UD-Q4_K_XL.gguf \
-ngl 99 \
-c 128000 \
-fa on \
-np 1 \
-b 2048 \
-ub 512 \
--cache-type-k q8_0 \
--cache-type-v q8_0 \
--spec-type draft-mtp \
--spec-draft-n-max 2 \
--host 0.0.0.0 \
--port 8081 \
--jinja \
--temp 1.0 \
--min-p 0.05 \
--top-p 0.95 \
--top-k 40 \
--repeat-penalty 1.0

temp 1.0 is better for MOE models
temp 0.2 is better for dense models

mpt can cause looping? in qwen3.6 35B UD-Q4_K_XL?
parallel processing can cause looping? use -np 1?

# is able to come out from loops
./bin/llama-server   -m ../../models/Qwen3.6/MTP/Qwen3.6-35B-A3B-UD-Q6_K_XL.gguf   
-ngl 99   
-c 128000 
-fa on
-np 1  
-b 2048  
-ub 512 
--host 0.0.0.0 
--port 8081  
--jinja  
--temp 1.0   
--min-p 0.05
--top-p 0.95 
--top-k 40  
--repeat-penalty 1.05  
--presence-penalty 0.1  
--device CUDA1,CUDA2
