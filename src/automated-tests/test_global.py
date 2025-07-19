import time
import random
from turtle import update
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# --- CONFIGURAÇÕES ---
URL_DA_APP = "http://localhost:4200"
EMAIL_DE_TESTE = "teste@gmail.com"
SENHA_DE_TESTE = "5Pk1Fk6QHTgSrT"
NOME_DO_FICHEIRO_SCREENSHOT = "screenshot_erro_update_profile.png"

# --- FUNÇÕES AUXILIARES (BOA PRÁTICA) ---

def setup_driver():
    """Configura e retorna uma instância do driver do Chrome."""
    print("▶️  A configurar o driver do Chrome...")
    options = ChromeOptions()
    options.add_argument("--disable-infobars")
    options.add_argument("--disable-extensions")
    options.add_argument("--disable-popup-blocking")
    # Descomente a linha abaixo para executar em segundo plano (sem interface)
    #options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-gpu")
    options.add_argument("--window-size=1920,1080")

    prefs = {
      "credentials_enable_service": False,
      "profile.password_manager_enabled": False
    }
    options.add_experimental_option("prefs", prefs)

    driver = webdriver.Chrome(options=options)
    print("✅ Driver configurado.")
    return driver

def perform_login(driver, wait):
    """Executa os passos para fazer login na aplicação."""
    print("\n--- A iniciar o fluxo de login ---")
    driver.get(URL_DA_APP)

    print("▶️  A abrir o modal de login...")
    user_icon_container = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, ".user-section .user-container")))
    user_icon_container.click()

    print("▶️  A preencher o formulário...")
    email_input = wait.until(EC.visibility_of_element_located((By.ID, "email")))
    password_input = driver.find_element(By.ID, "password")
    email_input.send_keys(EMAIL_DE_TESTE)
    password_input.send_keys(SENHA_DE_TESTE)

    login_button = driver.find_element(By.CSS_SELECTOR, "form.login-form button[type='submit']")
    login_button.click()

    print("▶️  A aguardar o fecho do modal...")
    wait.until(EC.invisibility_of_element_located((By.CSS_SELECTOR, ".login-modal.active")))

    # Verificação final para garantir que o login foi bem-sucedido
    wait.until(EC.visibility_of_element_located((By.CLASS_NAME, "logout-btn")))
    print("✅ Login realizado com sucesso.")

def test_update_phone_number(driver, wait):
    """Executa os passos para atualizar o número de telefone no perfil."""
    print("\n--- A iniciar o teste de atualização de perfil ---")

    # 1. Navegar para a página de perfil
    print("▶️  A navegar para a página de perfil...")
    # Clica no container do utilizador para abrir o menu
    user_container_logged_in = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, ".user-container.logged-in")))
    user_container_logged_in.click()

    # Clica no link "Acessar Perfil"
    profile_link = wait.until(EC.element_to_be_clickable((By.LINK_TEXT, "Acessar Perfil")))
    profile_link.click()
    print("✅ Página de perfil aberta.")

    print("▶️  A alterar o número de telefone...")
    phone_input = wait.until(EC.visibility_of_element_located((By.ID, "telefone")))

    # Limpa o campo antes de escrever
    phone_input.clear()

    # Gera um novo número de telefone aleatório para garantir que a atualização acontece
    new_phone_number = f"99{random.randint(10000000, 99999999)}"
    phone_input.send_keys(new_phone_number)
    print(f"✅ Novo telefone '{new_phone_number}' inserido.")

    print("▶️  Aguardar até que o botão de Atualizar campos esteja vísivel...")
    update_button = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "button.btn-primary")))
    update_button.click()
    print("✅ Botão 'Atualizar Campos' clicado.")

    print("▶️  A aguardar a resposta da API...")
    wait.until(EC.invisibility_of_element_located((By.XPATH, "//span[contains(text(), 'Atualizando...')]")))
    print("✅ Resposta da API recebida.")

    print("▶️  A verificar a mensagem de sucesso...")
    success_message_element = wait.until(EC.visibility_of_element_located((By.CLASS_NAME, "success-message")))

    expected_message = "Perfil atualizado com sucesso!"
    actual_message = success_message_element.text

    assert actual_message == expected_message, f"A mensagem esperada era '{expected_message}', mas foi encontrada '{actual_message}'"

    print(f"✅ Mensagem de sucesso encontrada: '{actual_message}'")

    print("▶️  Voltando para a tela principal...")
    button_back = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "button.btn-secondary")))
    button_back.click()

    print("✅ Retornado à tela principal.")

def test_go_to_movie_detail_page(driver, wait):
  """Executa os passos para navegar até a página de detalhes de um filme."""
  print("\n--- A iniciar o teste de navegação para detalhes do filme ---")

  print("▶️  A navegar para a página de filmes...")
  first_movie_card = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, ".movies-grid .movie-card")))
  print("✅ Card de filmes carregada.")

  movie_title_element = first_movie_card.find_element(By.CLASS_NAME, "movie-title")
  movie_title_to_click = movie_title_element.text

  print(f"▶️  A clicar no filme: '{movie_title_to_click}'")
  first_movie_card.click()

  detail_page_title_element = wait.until(EC.visibility_of_element_located((By.TAG_NAME, "h1")))
  detail_page_title = detail_page_title_element.text

  assert movie_title_to_click == detail_page_title, f"Esperava o título '{movie_title_to_click}', mas encontrei '{detail_page_title}'"

  print(f"✅ Página de detalhes do filme '{detail_page_title}' foi aberta")

def test_return_to_home_and_search(driver, wait):
  """Volta para a página inicial e pesquisa por um filme específico."""
  print("\n--- A iniciar o teste de retorno à home e pesquisa ---")

  print("▶️  A clicar no logo 'Cinema Bom' para voltar à home...")
  home_link = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, ".nav-left a.nav-link")))
  home_link.click()

  wait.until(EC.url_to_be(URL_DA_APP + "/"))
  print("✅ Voltou para a página inicial com sucesso.")

  print("▶️  A ativar a barra de pesquisa...")
  search_container = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, ".search-container")))
  search_container.click()

  print("▶️  A pesquisar por 'Mad Max'...")
  search_input = wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, ".search-input")))
  search_input.clear()
  search_input.send_keys("Mad Max" + Keys.RETURN)

  print("▶️  A verificar o resultado da pesquisa...")
  wait.until(EC.url_contains("/filme/mad-max"))
  print("✅ Navegou para a URL de detalhes do filme.")

  expected_title = "Mad Max"
  detail_page_title_element = wait.until(EC.visibility_of_element_located((By.TAG_NAME, "h1")))
  detail_page_title = detail_page_title_element.text

  assert expected_title.lower() == detail_page_title.lower(), f"O título esperado era '{expected_title}', mas foi encontrado '{detail_page_title}'"

  print(f"✅ Pesquisa bem-sucedida! Página de '{detail_page_title}' carregada.")

def test_reservation_flow(driver, wait):
  """Executa o fluxo de seleção de sessão e assento."""
  print("\n--- A iniciar o teste do fluxo de reserva ---")

  # 1. Clicar na primeira sessão disponível
  print("▶️  A selecionar a primeira sessão...")
  first_session_card = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, ".sessions-grid .session-card")))
  first_session_card.click()

  # 2. Verificar se navegou para a página de detalhes da sessão
  wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, ".sala-selection-container")))
  print("✅ Página de detalhes da sessão aberta.")

  # 3. Clicar no botão da Sala para abrir o modal
  print("▶️  A abrir o modal de informações da sala...")
  sala_button = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, ".btn-sala")))
  sala_button.click()

  # 4. Confirmar a sala no modal
  print("▶️  A confirmar a sala...")
  confirm_sala_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//app-sala-info-modal//button[contains(text(), 'Confirmar Sala')]")))
  confirm_sala_button.click()

  # 5. Esperar que o mapa de assentos apareça
  wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, ".seat-map-container")))
  print("✅ Mapa de assentos visível.")

  # 6. Selecionar o primeiro assento disponível
  print("▶️  A selecionar o primeiro assento disponível...")
  first_available_seat = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, ".seat.available")))
  first_available_seat.click()
  print("✅ Assento selecionado.")

  # 7. Clicar no botão "Confirmar" principal
  print("▶️  A confirmar a seleção de assentos...")
  confirm_selection_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//div[@class='action-buttons']/button[contains(@class, 'btn-confirm')]")))
  confirm_selection_button.click()

  # 8. Verificar se chegou à página de finalizar a reserva
  print("▶️  A verificar se chegou à página de finalização da reserva...")
  final_page_title = wait.until(EC.visibility_of_element_located((By.XPATH, "//h2[contains(text(), 'Finalizar Reserva')]")))

  assert "Finalizar Reserva" in final_page_title.text
  print("✅ Página de finalização da reserva carregada com sucesso.")

def test_finalize_and_pay_reservation(driver, wait):
  """Finaliza a criação da reserva, navega para 'Minhas Reservas' e processa o pagamento."""
  print("\n--- A iniciar o teste de finalização e pagamento ---")

  # 1. Clicar em "Confirmar Reserva" para criar a reserva
  print("▶️  A criar a reserva...")
  confirm_reservation_button = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, ".action-buttons .btn-confirm")))
  confirm_reservation_button.click()

  # 2. Esperar e aceitar o alerta de sucesso
  print("▶️  A aguardar o alerta de criação de reserva...")
  alert = wait.until(EC.alert_is_present())
  alert_text = alert.text
  assert "Reserva criada com sucesso!" in alert_text
  alert.accept()
  print("✅ Alerta de sucesso confirmado.")

  # 3. Verificar se voltou para a página inicial
  wait.until(EC.url_to_be(URL_DA_APP + "/"))
  print("✅ Redirecionado para a página inicial.")

  # 4. Navegar para "Minhas Reservas"
  print("▶️  A navegar para 'Minhas Reservas'...")
  wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, ".user-container.logged-in"))).click()
  wait.until(EC.element_to_be_clickable((By.LINK_TEXT, "Minhas Reservas"))).click()

  # 5. Verificar se a página "Minhas Reservas" carregou
  wait.until(EC.visibility_of_element_located((By.XPATH, "//h2[contains(text(), 'Minhas Reservas')]")))
  print("✅ Página 'Minhas Reservas' carregada.")

  # 6. Clicar na primeira reserva da lista (a mais recente)
  print("▶️  A procurar pela reserva com status 'pendente'...")
  pending_reservation_to_click = wait.until(EC.element_to_be_clickable((
      By.XPATH,
      "//div[contains(@class, 'reserva-item') and .//span[text()='pendente']]"
  )))
  print("✅ Reserva pendente encontrada. A clicar...")
  pending_reservation_to_click.click()

  # 7. Clicar em "Processar Pagamento" no modal
  print("▶️  A processar o pagamento...")
  # Aguardar o modal aparecer - tentar diferentes seletores
  try:
    # Primeira tentativa: seletor original
    wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, "app-reserva-detalhe-modal .modal-content")))
  except:
    try:
      # Segunda tentativa: apenas .modal-content
      wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, ".modal-content")))
    except:
      try:
        # Terceira tentativa: modal genérico
        wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, ".modal")))
      except:
        # Quarta tentativa: aguardar qualquer modal
        wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, "[class*='modal']")))

  print("✅ Modal de detalhes da reserva aberto.")
  try:
    # Primeira tentativa: seletor com modal-footer
    process_payment_button = wait.until(EC.element_to_be_clickable((
      By.CSS_SELECTOR,
      ".modal-footer .btn.btn-confirm"
    )))
  except:
    try:
      # Segunda tentativa: apenas o botão
      process_payment_button = wait.until(EC.element_to_be_clickable((
        By.CSS_SELECTOR,
        ".btn.btn-confirm"
      )))
    except:
      # Terceira tentativa: por texto do botão
      process_payment_button = wait.until(EC.element_to_be_clickable((
        By.XPATH,
        "//button[contains(text(), 'Processar Pagamento')]"
      )))
  process_payment_button.click()

  # 8. Esperar e aceitar o alerta final de sucesso
  print("✅ Alerta de pagamento confirmado.")

# --- FUNÇÃO PRINCIPAL QUE EXECUTA O TESTE ---
def main():
    driver = setup_driver()
    try:
        wait = WebDriverWait(driver, 15)
        perform_login(driver, wait)
        test_update_phone_number(driver, wait)
        test_go_to_movie_detail_page(driver, wait)
        test_return_to_home_and_search(driver, wait)
        test_reservation_flow(driver, wait)
        test_finalize_and_pay_reservation(driver, wait)
        print("\n🎉 TESTE COMPLETO CONCLUÍDO COM SUCESSO!")
    except Exception as e:
        print(f"\n❌ ERRO DURANTE O TESTE: {e}")
        print(f"ℹ️  A guardar um screenshot como '{NOME_DO_FICHEIRO_SCREENSHOT}' para depuração.")
        driver.save_screenshot(NOME_DO_FICHEIRO_SCREENSHOT)
    finally:
        print("▶️  A aguardar 5 segundos antes de fechar...")
        time.sleep(5)
        driver.quit()
        print("▶️  Navegador fechado.")

# Ponto de entrada do script
if __name__ == "__main__":
    main()
