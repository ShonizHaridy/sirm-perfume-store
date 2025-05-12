import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaUserPlus } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();
  const { addNotification } = useApp();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const redirectTo = new URLSearchParams(location.search).get('redirect') || '/';

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = t('name_required');
    }
    
    if (!formData.email.trim()) {
      newErrors.email = t('email_required');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('valid_email_required');
    }
    
    if (!formData.password) {
      newErrors.password = t('password_required');
    } else if (formData.password.length < 6) {
      newErrors.password = t('password_length');
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t('confirm_password_required');
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = t('passwords_not_match');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Omit confirmPassword from the data sent to the server
      const { confirmPassword, ...registrationData } = formData;
      
      await register(registrationData);
      addNotification(t('registration_success'), 'success');
      navigate(redirectTo);
    } catch (err) {
      const errorMessage = err.response?.data?.message || t('registration_failed');
      setErrors(prev => ({
        ...prev,
        general: errorMessage
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <RegisterContainer>
        <RegisterImageContainer>
          <img src="/images/register-image.jpg" alt="Register" />
        </RegisterImageContainer>
        
        <RegisterFormContainer>
          <RegisterHeader>
            <h1>{t('create_account')}</h1>
            <p>{t('register_subtitle')}</p>
          </RegisterHeader>
          
          {errors.general && (
            <ErrorMessage>{errors.general}</ErrorMessage>
          )}
          
          <RegisterForm onSubmit={handleSubmit}>
            <FormGroup>
              <FormLabel>
                <FaUser />
                <span>{t('full_name')}</span>
              </FormLabel>
              <FormInput
                type="text"
                name="name"
                placeholder={t('name_placeholder')}
                value={formData.name}
                onChange={handleChange}
                hasError={!!errors.name}
              />
              {errors.name && (
                <ErrorMessage>{errors.name}</ErrorMessage>
              )}
            </FormGroup>
            
            <FormGroup>
              <FormLabel>
                <FaEnvelope />
                <span>{t('email_address')}</span>
              </FormLabel>
              <FormInput
                type="email"
                name="email"
                placeholder={t('email_placeholder')}
                value={formData.email}
                onChange={handleChange}
                hasError={!!errors.email}
              />
              {errors.email && (
                <ErrorMessage>{errors.email}</ErrorMessage>
              )}
            </FormGroup>
            
            <FormRow>
              <FormGroup>
                <FormLabel>
                  <FaLock />
                  <span>{t('password')}</span>
                </FormLabel>
                <FormInput
                  type="password"
                  name="password"
                  placeholder={t('password_placeholder')}
                  value={formData.password}
                  onChange={handleChange}
                  hasError={!!errors.password}
                />
                {errors.password && (
                  <ErrorMessage>{errors.password}</ErrorMessage>
                )}
              </FormGroup>
              
              <FormGroup>
                <FormLabel>
                  <FaLock />
                  <span>{t('confirm_password')}</span>
                </FormLabel>
                <FormInput
                  type="password"
                  name="confirmPassword"
                  placeholder={t('confirm_password_placeholder')}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  hasError={!!errors.confirmPassword}
                />
                {errors.confirmPassword && (
                  <ErrorMessage>{errors.confirmPassword}</ErrorMessage>
                )}
              </FormGroup>
            </FormRow>
            
            <FormGroup>
              <FormLabel>
                <FaPhone />
                <span>{t('phone_number')}</span>
              </FormLabel>
              <FormInput
                type="tel"
                name="phone"
                placeholder={t('phone_placeholder')}
                value={formData.phone}
                onChange={handleChange}
              />
            </FormGroup>
            
            <TermsAgreement>
              <input type="checkbox" id="terms" required />
              <label htmlFor="terms">
                {t('agree_terms')}{' '}
                <Link to="/terms">{t('terms_conditions')}</Link>
              </label>
            </TermsAgreement>
            
            <SubmitButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? t('creating_account') : t('create_account')}
              {!isSubmitting && <FaUserPlus />}
            </SubmitButton>
          </RegisterForm>
          
          <LoginPrompt>
            {t('already_account')}{' '}
            <LoginLink to={`/login${location.search}`}>
              {t('login')}
            </LoginLink>
          </LoginPrompt>
        </RegisterFormContainer>
      </RegisterContainer>
    </div>
  );
};

// Styled Components
const RegisterContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 80vh;
  margin: 50px 0;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const RegisterImageContainer = styled.div`
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const RegisterFormContainer = styled.div`
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  
  @media (max-width: 480px) {
    padding: 30px 20px;
  }
`;

const RegisterHeader = styled.div`
  margin-bottom: 30px;
  
  h1 {
    font-size: 28px;
    color: var(--primary-color);
    margin-bottom: 10px;
  }
  
  p {
    color: #666;
  }
`;

const RegisterForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const FormRow = styled.div`
  display: flex;
  gap: 20px;
  
  @media (max-width: 580px) {
    flex-direction: column;
  }
`;

const FormLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  color: var(--primary-color);
  font-weight: 500;
  
  svg {
    color: var(--secondary-color);
  }
`;

const FormInput = styled.input`
  padding: 12px 15px;
  border: 1px solid ${props => props.hasError ? 'var(--danger-color)' : '#ddd'};
  border-radius: 4px;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? 'var(--danger-color)' : 'var(--secondary-color)'};
  }
`;

const ErrorMessage = styled.div`
  color: var(--danger-color);
  font-size: 14px;
  margin-top: 5px;
`;

const TermsAgreement = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  color: #666;
  
  input {
    margin-top: 5px;
    accent-color: var(--secondary-color);
  }
  
  a {
    color: var(--secondary-color);
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px 15px;
  background-color: var(--secondary-color);
  color: var(--primary-color);
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
  
  &:hover {
    background-color: var(--accent-color);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const LoginPrompt = styled.div`
  margin-top: 30px;
  text-align: center;
  color: #666;
`;

const LoginLink = styled(Link)`
  color: var(--secondary-color);
  text-decoration: none;
  font-weight: 600;
  
  &:hover {
    text-decoration: underline;
  }
`;

export default Register;