// Utilitários gerais
class RoomReserveApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupFormValidation();
    }

    setupEventListeners() {
        // Confirmação para exclusões
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-delete') || e.target.closest('.btn-delete')) {
                e.preventDefault();
                const button = e.target.classList.contains('btn-delete') ? e.target : e.target.closest('.btn-delete');
                this.confirmDelete(button);
            }
        });

        // Submissão de formulários via AJAX
        document.addEventListener('submit', (e) => {
            if (e.target.classList.contains('ajax-form')) {
                e.preventDefault();
                this.submitForm(e.target);
            }
        });
    }

    setupFormValidation() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input[required], select[required]');
            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.clearFieldError(input));
            });
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';

        // Validação básica de campo obrigatório
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'Este campo é obrigatório';
        }

        // Validação de email
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Digite um email válido';
            }
        }

        // Validação de horário
        if (fieldName === 'horario_fim' && value) {
            const inicioField = document.querySelector('input[name="horario_inicio"]');
            if (inicioField && inicioField.value && value <= inicioField.value) {
                isValid = false;
                errorMessage = 'Horário de fim deve ser posterior ao horário de início';
            }
        }

        this.showFieldValidation(field, isValid, errorMessage);
        return isValid;
    }

    showFieldValidation(field, isValid, errorMessage) {
        this.clearFieldError(field);
        
        if (!isValid) {
            field.classList.add('is-invalid');
            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            errorDiv.textContent = errorMessage;
            field.parentNode.appendChild(errorDiv);
        } else {
            field.classList.remove('is-invalid');
            field.classList.add('is-valid');
        }
    }

    clearFieldError(field) {
        field.classList.remove('is-invalid', 'is-valid');
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    async confirmDelete(button) {
        const itemType = button.dataset.type || 'item';
        const itemName = button.dataset.name || '';
        
        const message = `Tem certeza que deseja excluir ${itemType} ${itemName}? Esta ação não pode ser desfeita.`;
        
        if (confirm(message)) {
            const url = button.href || button.dataset.url;
            await this.deleteItem(url, button);
        }
    }

    async deleteItem(url, button) {
        try {
            this.setButtonLoading(button, true);
            
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                this.showAlert('Item excluído com sucesso!', 'success');
                // Remove a linha da tabela
                const row = button.closest('tr');
                if (row) {
                    row.style.opacity = '0.5';
                    setTimeout(() => row.remove(), 300);
                }
            } else {
                throw new Error('Erro ao excluir item');
            }
        } catch (error) {
            console.error('Erro:', error);
            this.showAlert('Erro ao excluir item. Tente novamente.', 'error');
        } finally {
            this.setButtonLoading(button, false);
        }
    }

    async submitForm(form) {
        try {
            // Validar todos os campos
            const inputs = form.querySelectorAll('input[required], select[required]');
            let isFormValid = true;
            
            inputs.forEach(input => {
                if (!this.validateField(input)) {
                    isFormValid = false;
                }
            });

            if (!isFormValid) {
                this.showAlert('Por favor, corrija os erros no formulário', 'error');
                return;
            }

            const submitButton = form.querySelector('button[type="submit"]');
            this.setButtonLoading(submitButton, true);

            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            const method = form.method || 'POST';
            const url = form.action;

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const result = await response.json();
                this.showAlert('Operação realizada com sucesso!', 'success');
                
                // Redirecionar ou atualizar página
                setTimeout(() => {
                    const redirectUrl = form.dataset.redirect;
                    if (redirectUrl) {
                        window.location.href = redirectUrl;
                    } else {
                        window.location.reload();
                    }
                }, 1500);
            } else {
                throw new Error('Erro na operação');
            }
        } catch (error) {
            console.error('Erro:', error);
            this.showAlert('Erro ao processar formulário. Tente novamente.', 'error');
        } finally {
            const submitButton = form.querySelector('button[type="submit"]');
            this.setButtonLoading(submitButton, false);
        }
    }

    setButtonLoading(button, isLoading) {
        if (!button) return;

        if (isLoading) {
            button.disabled = true;
            button.dataset.originalText = button.innerHTML;
            button.innerHTML = '<span class="loading"></span> Processando...';
        } else {
            button.disabled = false;
            button.innerHTML = button.dataset.originalText || button.innerHTML;
        }
    }

    showAlert(message, type = 'info') {
        // Remove alertas existentes
        const existingAlerts = document.querySelectorAll('.alert');
        existingAlerts.forEach(alert => alert.remove());

        // Cria novo alerta
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        
        const icon = type === 'error' ? 'exclamation-triangle' : 'check-circle';
        alertDiv.innerHTML = `
            <i class="fas fa-${icon}"></i>
            ${message}
        `;

        // Insere no início do main
        const main = document.querySelector('.main .container');
        if (main) {
            main.insertBefore(alertDiv, main.firstChild);
        }

        // Remove automaticamente após 5 segundos
        setTimeout(() => {
            alertDiv.style.opacity = '0';
            setTimeout(() => alertDiv.remove(), 300);
        }, 5000);
    }

    // Utilitário para buscar dados
    async fetchData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Erro na requisição');
            }
            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
            this.showAlert('Erro ao carregar dados', 'error');
            return null;
        }
    }

    // Utilitário para formatar data
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    }

    // Utilitário para formatar horário
    formatTime(timeString) {
        return timeString.substring(0, 5); // Remove segundos se houver
    }
}

// Funções específicas para reservas
class ReservaManager {
    static async checkAvailability(salaId, data, horarioInicio, horarioFim, reservaId = null) {
        try {
            const params = new URLSearchParams({
                sala_id: salaId,
                data: data,
                horario_inicio: horarioInicio,
                horario_fim: horarioFim
            });
            
            if (reservaId) {
                params.append('reserva_id', reservaId);
            }

            const response = await fetch(`/api/reservas/check-availability?${params}`);
            const result = await response.json();
            
            return result.available;
        } catch (error) {
            console.error('Erro ao verificar disponibilidade:', error);
            return false;
        }
    }

    static setupAvailabilityCheck() {
        const form = document.querySelector('#reserva-form');
        if (!form) return;

        const salaSelect = form.querySelector('select[name="sala_id"]');
        const dataInput = form.querySelector('input[name="data"]');
        const inicioInput = form.querySelector('input[name="horario_inicio"]');
        const fimInput = form.querySelector('input[name="horario_fim"]');

        if (salaSelect && dataInput && inicioInput && fimInput) {
            [salaSelect, dataInput, inicioInput, fimInput].forEach(input => {
                input.addEventListener('change', this.validateAvailability.bind(this));
            });
        }
    }

    static async validateAvailability() {
        const form = document.querySelector('#reserva-form');
        const salaId = form.querySelector('select[name="sala_id"]').value;
        const data = form.querySelector('input[name="data"]').value;
        const inicio = form.querySelector('input[name="horario_inicio"]').value;
        const fim = form.querySelector('input[name="horario_fim"]').value;
        const reservaId = form.querySelector('input[name="id"]')?.value;

        if (salaId && data && inicio && fim) {
            const available = await this.checkAvailability(salaId, data, inicio, fim, reservaId);
            
            const messageDiv = document.querySelector('#availability-message') || 
                              this.createAvailabilityMessage();
            
            if (available) {
                messageDiv.className = 'alert alert-success';
                messageDiv.innerHTML = '<i class="fas fa-check-circle"></i> Horário disponível!';
            } else {
                messageDiv.className = 'alert alert-error';
                messageDiv.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Horário não disponível. Escolha outro horário.';
            }
        }
    }

    static createAvailabilityMessage() {
        const messageDiv = document.createElement('div');
        messageDiv.id = 'availability-message';
        
        const form = document.querySelector('#reserva-form');
        form.appendChild(messageDiv);
        
        return messageDiv;
    }
}

// Inicializar aplicação quando DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new RoomReserveApp();
    ReservaManager.setupAvailabilityCheck();
});
