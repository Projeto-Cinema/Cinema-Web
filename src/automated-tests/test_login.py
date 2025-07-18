import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.common.exceptions import TimeoutException
# Importa as Opções do Chrome
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# --- CONFIGURAÇÕES ---
URL_DA_APP = "http://localhost:4200"
EMAIL_DE_TESTE = "teste@gmail.com"
SENHA_DE_TESTE = "testeteste"
NOME_DO_FICHEIRO_SCREENSHOT = "screenshot_erro_login.png"

# --- INÍCIO DO TESTE ---

# --- CONFIGURAÇÃO ROBUSTA PARA WSL/DOCKER ---
# 1. Configura as opções do Chrome
options = ChromeOptions()
# A opção '--headless' executa o teste sem abrir uma janela de navegador visível.
# É altamente recomendado para estabilidade em ambientes como o WSL.
options.add_argument("--headless") 
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage") 
# A opção '--disable-gpu' também ajuda a prevenir crashes em ambientes sem uma GPU dedicada.
options.add_argument("--disable-gpu")
options.add_argument("--window-size=1920,1080")

# 2. Inicia o driver com as opções configuradas.
# O Selenium 4+ gere o chromedriver automaticamente, não precisamos mais do webdriver-manager.
driver = webdriver.Chrome(options=options)

try:
    print("▶️  Iniciando o teste de login...")
    
    driver.get(URL_DA_APP)
    print("✅ Página aberta com sucesso.")

    # Aumentamos o tempo de espera para 15 segundos para dar mais margem à API
    wait = WebDriverWait(driver, 15)

    print("▶️  A procurar o ícone de utilizador para abrir o modal...")
    user_icon_container = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, ".user-section .user-container")))
    user_icon_container.click()
    print("✅ Modal de login aberto.")

    print("▶️  A preencher o formulário de login...")
    email_input = wait.until(EC.visibility_of_element_located((By.ID, "email")))
    password_input = driver.find_element(By.ID, "password")
    email_input.send_keys(EMAIL_DE_TESTE)
    password_input.send_keys(SENHA_DE_TESTE)
    print("✅ Formulário preenchido.")

    login_button = driver.find_element(By.CSS_SELECTOR, "form.login-form button[type='submit']")
    login_button.click()
    print("✅ Botão 'Entrar' clicado.")

    # --- LÓGICA DE VERIFICAÇÃO MELHORADA ---
    print("▶️  A aguardar o fecho do modal de login...")
    # Esperamos que o modal de login (que tem a classe 'active' quando está aberto) se torne invisível.
    # Isto garante que a animação de fecho terminou antes de prosseguirmos.
    wait.until(EC.invisibility_of_element_located((By.CSS_SELECTOR, ".login-modal.active")))
    print("✅ Modal de login fechado.")

    print("▶️  A verificar o resultado do login (sucesso ou falha)...")
    try:
        # Agora que o modal desapareceu, procuramos pelo botão de logout com segurança.
        logout_button = wait.until(EC.visibility_of_element_located((By.CLASS_NAME, "logout-button")))
        print("🎉 TESTE CONCLUÍDO: Login realizado com sucesso!")
        print(f"✅ O botão '{logout_button.text}' foi encontrado.")
    except TimeoutException:
        # Se o botão de logout não aparecer, procuramos pela mensagem de erro (condição de FALHA)
        try:
            error_message_element = driver.find_element(By.CLASS_NAME, "error-message")
            print("❌ TESTE FALHOU (como esperado para credenciais erradas):")
            print(f"✅ Mensagem de erro encontrada: '{error_message_element.text}'")
        except:
            # Se não encontrar nem o sucesso nem o erro, algo inesperado aconteceu.
            print("❌ ERRO INESPERADO: O teste falhou, mas não foi encontrada nenhuma mensagem de erro.")
            print(f"ℹ️  A guardar um screenshot como '{NOME_DO_FICHEIRO_SCREENSHOT}' para depuração.")
            driver.save_screenshot(NOME_DO_FICHEIRO_SCREENSHOT)
            # Levanta a exceção original para que o erro principal seja visível
            raise

except Exception as e:
    print(f"❌ ERRO DURANTE O TESTE: {e}")

finally:
    time.sleep(3)
    driver.quit()
    print("▶️  Navegador fechado.")